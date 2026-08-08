/**
 * MindEcho AI 2026 — Google Apps Script v2.1
 * mindecho-ai-113 — Admin Analytics + Disclaimer PDF Upload to Google Drive
 * Spreadsheet ID: 1Nk0lLgBdcVsuPtQch0mRHf81gpyUMz3zHYJROVcUNV4
 * Google Drive Folder: root / get777903@gmail.com
 */
const SPREADSHEET_ID = "1Nk0lLgBdcVsuPtQch0mRHf81gpyUMz3zHYJROVcUNV4";
const MAX_ROWS = 500;
const ADMIN_READ_KEY = "mindecho_read_key_2026";
// Target Google Drive folder ID (My Drive root = null means root folder)
const DRIVE_FOLDER_ID = "0AFF5I_yKUz4MUk9PVA";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // ---- PDF UPLOAD BRANCH ----
    if (data.action === 'uploadDisclaimerPDF') {
      return handleDisclaimerPDFUpload(data);
    }

    // ---- ANALYTICS BRANCH ----
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheets = ss.getSheets();
    let sheet = sheets[sheets.length - 1];
    if (sheet.getLastRow() >= (MAX_ROWS + 1)) {
      sheet = ss.insertSheet("Batch " + (sheets.length + 1));
      createHeader(sheet);
    } else if (sheet.getLastRow() === 0) {
      createHeader(sheet);
    }
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("ru-RU"),
      data.event_type || "unknown",
      data.session_id || "GUEST",
      data.user_name || "-",
      data.email || "-",
      data.phone || "-",
      data.plan_name || "-",
      data.price || 0,
      data.language || "ru",
      data.device_type || detectDevice(data.user_agent),
      data.referrer || "direct",
      data.page_section || "-",
      data.scroll_depth || 0,
      data.time_on_page || 0,
      data.child_name || "-",
      data.payment_intent || false,
      data.user_agent || "-"
    ]);
    return json200({ status: "success" });
  } catch (err) {
    return json200({ status: "error", message: err.toString() });
  }
}

/**
 * Saves base64-encoded PDF to Google Drive folder and logs to spreadsheet.
 */
function handleDisclaimerPDFUpload(data) {
  try {
    const filename = data.filename || ("MindEchoAI_Disclaimer_" + new Date().getTime() + ".pdf");
    const base64 = data.fileBase64 || "";
    const decoded = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(decoded, "application/pdf", filename);

    // Save to Google Drive target folder
    var folder;
    try {
      folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    } catch(e) {
      folder = DriveApp.getRootFolder();
    }
    var file = folder.createFile(blob);
    var fileUrl = file.getUrl();

    // Log to spreadsheet
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheets = ss.getSheets();
      let sheet = sheets[sheets.length - 1];
      if (sheet.getLastRow() === 0) { createHeader(sheet); }
      sheet.appendRow([
        new Date().toLocaleString("ru-RU"),
        "NDA_PDF_Uploaded",
        "SYSTEM",
        data.userName || "-",
        data.email || "-",
        data.contact || "-",
        "Disclaimer_PDF",
        0,
        "ru+en",
        "web",
        "direct",
        "NDA_Modal",
        0,
        0,
        "-",
        false,
        fileUrl
      ]);
    } catch(logErr) {}

    // Send email notification to owner
    try {
      MailApp.sendEmail({
        to: "get777903@gmail.com",
        subject: "MindEcho AI — New Disclaimer PDF signed: " + (data.userName || "Unknown"),
        htmlBody: "<h2>MindEcho AI — Disclaimer Signed</h2>"
          + "<p><b>Name / FIO:</b> " + (data.userName || "-") + "</p>"
          + "<p><b>WhatsApp / Telegram:</b> " + (data.contact || "-") + "</p>"
          + "<p><b>Email:</b> " + (data.email || "-") + "</p>"
          + "<p><b>Date / Data:</b> " + (data.dateStr || "-") + "</p>"
          + "<p><b>Google Drive file:</b> <a href='" + fileUrl + "'>" + filename + "</a></p>"
      });
    } catch(mailErr) {}

    return json200({ status: "success", file_url: fileUrl });
  } catch(err) {
    return json200({ status: "error", message: err.toString() });
  }
}

function doGet(e) {
  try {
    if (!e.parameter || e.parameter.key !== ADMIN_READ_KEY) {
      return json200({ status: "auth_error", message: "Unauthorized" });
    }
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = ss.getSheets();
    let allRows = [];
    sheets.forEach(function(sheet) {
      const data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var r = data[i];
        if (!r[0]) continue;
        allRows.push({
          timestamp: r[0], event_type: r[1], session_id: r[2],
          user_name: r[3], email: r[4], phone: r[5], plan_name: r[6],
          price: r[7], language: r[8], device_type: r[9], referrer: r[10],
          page_section: r[11], scroll_depth: r[12], time_on_page: r[13],
          child_name: r[14], payment_intent: r[15]
        });
      }
    });
    const stats = buildStats(allRows);
    return json200({ status: "success", total_rows: allRows.length, rows: allRows, stats: stats });
  } catch (err) {
    return json200({ status: "error", message: err.toString() });
  }
}

function buildStats(rows) {
  var eventCounts = {}, sessions = {}, emails = {}, phones = {};
  var childNames = {}, referrers = {}, devices = {}, hourlyClicks = {};
  var totalScroll = 0, scrollN = 0, totalTime = 0, timeN = 0;
  rows.forEach(function(r) {
    eventCounts[r.event_type] = (eventCounts[r.event_type] || 0) + 1;
    if (r.session_id && r.session_id !== "GUEST") sessions[r.session_id] = 1;
    if (r.email && r.email !== "-") emails[r.email.toLowerCase()] = 1;
    if (r.phone && r.phone !== "-") phones[r.phone] = 1;
    if (r.child_name && r.child_name !== "-") childNames[r.child_name] = (childNames[r.child_name] || 0) + 1;
    if (r.referrer) referrers[r.referrer] = (referrers[r.referrer] || 0) + 1;
    if (r.device_type) devices[r.device_type] = (devices[r.device_type] || 0) + 1;
    if (r.scroll_depth > 0) { totalScroll += Number(r.scroll_depth); scrollN++; }
    if (r.time_on_page > 0) { totalTime += Number(r.time_on_page); timeN++; }
    try {
      var hour = String(r.timestamp).split(" ")[1].split(":")[0];
      hourlyClicks[hour] = (hourlyClicks[hour] || 0) + 1;
    } catch(ex) {}
  });
  return {
    total_events: rows.length,
    unique_sessions: Object.keys(sessions).length,
    unique_emails: Object.keys(emails).length,
    unique_phones: Object.keys(phones).length,
    email_list: Object.keys(emails),
    phone_list: Object.keys(phones),
    event_counts: eventCounts,
    child_names: childNames,
    referrers: referrers,
    devices: devices,
    avg_scroll_depth: scrollN > 0 ? Math.round(totalScroll / scrollN) : 0,
    avg_time_on_page: timeN > 0 ? Math.round(totalTime / timeN) : 0,
    hourly_clicks: hourlyClicks,
    funnel: {
      page_views: eventCounts["Page_View"] || 0,
      pricing_views: eventCounts["Pricing_Viewed"] || 0,
      plan_clicks: (eventCounts["Buy_Basic_Click"] || 0) + (eventCounts["Buy_Premium_Click"] || 0) + (eventCounts["Buy_Pro_Click"] || 0),
      payment_intents: rows.filter(function(r){ return r.payment_intent === true || r.payment_intent === "true"; }).length,
      nda_signed: eventCounts["NDA_Signed"] || 0,
      meditations: eventCounts["Generate_Click"] || 0,
      plays: eventCounts["Play_Click"] || 0,
      voices_recorded: eventCounts["Voice_Recorded"] || 0
    }
  };
}

function detectDevice(ua) {
  if (!ua) return "unknown";
  if (/Mobile|Android|iPhone/i.test(ua)) return "mobile";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function json200(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function createHeader(sheet) {
  var headers = ["Дата и Время","Тип события","Session ID","Имя","Email","Телефон","Тариф","Цена ($)","Язык","Устройство","Источник","Раздел","Скролл (%)","Время (сек)","Имя ребёнка","Попытка оплаты","User Agent"];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setBackground("#1E40AF").setFontColor("#FFFFFF").setFontWeight("bold");
  sheet.setFrozenRows(1);
}
