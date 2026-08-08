/* ==========================================================================
   MindEcho AI 2026 — Main Application Engine (mindecho-ai-113)
   Admin Analytics Dashboard + Full Click Tracking + Scroll/Time Metrics
   ========================================================================== */

// Supabase Configuration
const supabaseUrl = 'https://yslrofsjeujsftlabuqn.supabase.co/rest/v1/analytics_events';
const supabaseKey = 'sb_publishable_tnc4wA3Cr-FtaDyjVz9Q6Q_fklMPSDr';

// Audio Track File Name
const MEDITATION_AUDIO_SRC = "meditation1.mp3";

// Unique session ID for this visit
const SESSION_ID = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();

// Analytics tracking state
const analyticsState = {
  pageStartTime: Date.now(),
  maxScrollDepth: 0,
  engagedTimers: { 30: false, 60: false, 120: false },
  pricingViewed: false
};

// Global Application State
const appState = {
  lang: 'ru',
  isRecording: false,
  mediaRecorder: null,
  recordedChunks: [],
  recordedAudioUrl: null,
  isPlayingAudio: false,
  isAnnualBilling: false,
  selectedPlan: 'Premium',
  selectedPrice: 14.99,
  audioTrack: null,
  currentCustDevScenario: 'burnout',
  signatureCanvas: null,
  signatureCtx: null,
  isDrawingSignature: false
};

// Initialize Signature Canvas & Setup Listeners on Load
document.addEventListener('DOMContentLoaded', () => {
  setupScrollListener();
  registerServiceWorker();
  initAudioPlayer();
  initSignatureCanvas();
  initAnalyticsTracking();
});

// Initialize Audio Element
function initAudioPlayer() {
  appState.audioTrack = new Audio(MEDITATION_AUDIO_SRC);

  appState.audioTrack.addEventListener('timeupdate', () => {
    if (appState.audioTrack && appState.audioTrack.duration) {
      const progress = (appState.audioTrack.currentTime / appState.audioTrack.duration) * 100;
      document.getElementById('player-progress').style.width = `${progress}%`;
      
      const currentMin = Math.floor(appState.audioTrack.currentTime / 60);
      const currentSec = Math.floor(appState.audioTrack.currentTime % 60).toString().padStart(2, '0');
      document.getElementById('player-time').innerText = `${currentMin}:${currentSec}`;
    }
  });

  appState.audioTrack.addEventListener('ended', () => {
    appState.isPlayingAudio = false;
    document.getElementById('play-btn').innerText = "▶";
    document.getElementById('player-progress').style.width = "100%";
  });
}

function switchLanguage(langKey, btnEl) {
  appState.lang = langKey;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  if (langKey === 'he') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', langKey);
  }
}

function setupScrollListener() {
  const stickyBar = document.getElementById('sticky-bar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      stickyBar.classList.remove('hidden');
    } else {
      stickyBar.classList.add('hidden');
    }
  });
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function selectAudioMode(modeKey) {
  const typeSelect = document.getElementById('meditation-type');
  if (typeSelect) typeSelect.value = modeKey;

  const emergencyPanel = document.getElementById('emergency-panel');
  if (modeKey === 'emergency') {
    emergencyPanel.classList.remove('hidden');
    emergencyPanel.scrollIntoView({ behavior: 'smooth' });
  } else {
    emergencyPanel.classList.add('hidden');
    scrollToSection('generator');
  }

  logClickAnalytics('AudioMode_Select', modeKey, 0);
}

function closeEmergencyPanel() {
  document.getElementById('emergency-panel').classList.add('hidden');
}

function toggleFullStoryText() {
  const fullStory = document.getElementById('story-full-text');
  const btn = document.getElementById('btn-toggle-story-text');
  if (fullStory) {
    if (fullStory.classList.contains('hidden')) {
      fullStory.classList.remove('hidden');
      if (btn) btn.innerText = "Свернуть текст 🔼";
    } else {
      fullStory.classList.add('hidden');
      if (btn) btn.innerText = "Развернуть весь текст 📖";
    }
  }
}

// MediaRecorder — Real Parent Microphone Recording with 30s Countdown
async function toggleVoiceRecord() {
  const micBtn = document.getElementById('mic-btn');
  const micText = document.getElementById('mic-text');
  const micWave = document.getElementById('mic-wave');

  // Auto-expand full story text for reading
  const fullStory = document.getElementById('story-full-text');
  const btnStory = document.getElementById('btn-toggle-story-text');
  if (fullStory && fullStory.classList.contains('hidden')) {
    fullStory.classList.remove('hidden');
    if (btnStory) btnStory.innerText = "Свернуть текст 🔼";
  }

  if (!appState.isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      appState.mediaRecorder = new MediaRecorder(stream);
      appState.recordedChunks = [];

      appState.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) appState.recordedChunks.push(e.data);
      };

      appState.mediaRecorder.onstop = () => {
        const blob = new Blob(appState.recordedChunks, { type: 'audio/webm' });
        appState.recordedAudioUrl = URL.createObjectURL(blob);
        micText.innerText = "Запись голоса (до 30 сек) завершена! (Сохранено)";

        // Convert blob to Base64 and send to Supabase with user contact details
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          const userEmail = localStorage.getItem('userEmail') || document.getElementById('auth-email')?.value || '-';
          const userContact = document.getElementById('nda-user-contact')?.value || document.getElementById('checkout-phone')?.value || '-';

          logClickAnalytics('Voice_Recorded_30s', 'Parent_Voice_Sample', 0, {
            user_name: 'Пользователь',
            email: userEmail,
            phone: userContact,
            elevenlabs_target: true,
            audio_base64_sample: base64Audio.substring(0, 100000)
          });
        };
      };

      appState.mediaRecorder.start();
      appState.isRecording = true;
      micBtn.classList.add('recording');
      micWave.classList.remove('hidden');

      let remainingSec = 30;
      micText.innerText = `Идет запись голоса... (Осталось ${remainingSec} сек)`;
      
      const recordTimerInterval = setInterval(() => {
        remainingSec--;
        if (remainingSec > 0 && appState.isRecording) {
          micText.innerText = `Идет запись голоса... (Осталось ${remainingSec} сек)`;
        } else {
          clearInterval(recordTimerInterval);
          if (appState.isRecording) {
            toggleVoiceRecord();
          }
        }
      }, 1000);

    } catch (err) {
      console.warn("Microphone access denied:", err);
      micText.innerText = "Голос проанализирован (ИИ слепок)";
      alert("Доступ к микрофону не предоставлен. Используется демо-слепок ИИ.");
    }
  } else {
    if (appState.mediaRecorder && appState.mediaRecorder.state !== 'inactive') {
      appState.mediaRecorder.stop();
    }
    appState.isRecording = false;
    micBtn.classList.remove('recording');
    micWave.classList.add('hidden');
  }

  logClickAnalytics('VoiceRecord_Toggled', appState.isRecording ? 'Start' : 'Stop', 0);
}

// Stage 3: LLM System Prompt Generator & Guardrail Safety Agent Configuration
const llmSystemPromptConfig = {
  role: "ИИ-генератор добрых сказок для расслабления и психологической поддержки детей",
  promptTemplate: "Напиши добрую аудио-сказку для расслабления и психологической поддержки ребенка, которая мягко показывает победу над страхом темноты, растворяет тревоги и наполняет уверенностью.",
  guardrailSafetyFilter: function(inputText) {
    const medicalKeywords = ["диагноз", "лечение", "препарат", "психотерапия", "патология", "симптом"];
    const containsMedicalAdvice = medicalKeywords.some(kw => inputText.toLowerCase().includes(kw));
    if (containsMedicalAdvice) {
      return {
        safe: false,
        message: "Сервис MindEcho AI не является медицинским средством и не предоставляет медицинских услуг. Сгенерирован развлекательный и развивающий аудио-контент для эмоциональной поддержки и расслабления."
      };
    }
    return { safe: true };
  }
};
window.llmSystemPromptConfig = llmSystemPromptConfig;

function generatePersonalMeditation() {
  const name = document.getElementById('child-name').value || "София";
  const gender = document.getElementById('child-gender').value;
  const audioSource = document.getElementById('audio-mode-source').value;

  logClickAnalytics('Generate_Click', '-', 0, { section: 'generator' });

  const typeSelect = document.getElementById('meditation-type');
  const meditationType = typeSelect ? typeSelect.value : 'bedtime';

  // Guardrail Safety check
  const safetyCheck = llmSystemPromptConfig.guardrailSafetyFilter(name);
  if (!safetyCheck.safe) {
    console.log(safetyCheck.message);
  }

  const customText = `Я хочу взять тебя ${name} с собой в небольшое путешествие в волшебное место, где мысли становятся реальностью...`;
  document.getElementById('meditation-text-box').innerText = customText;
  document.getElementById('player-title').innerText = `${name} — Сказка для расслабления`;

  appState.isPlayingAudio = false;

  if (appState.recordedAudioUrl) {
    playParentRecordedVoice();
  } else if (audioSource === 'tts') {
    document.getElementById('player-subtitle').innerText = `🤖 Динамический ИИ-диктор • Низкий тембр`;
    speakTextTTS(customText);
  } else {
    document.getElementById('player-subtitle').innerText = `🎵 Студийная MP3 фонограмма • Без музыки`;
    playMP3AudioTrack(true);
  }

  logClickAnalytics('Meditation_Generated', name, 0, { audio_source: audioSource });
}

function playParentRecordedVoice() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (appState.audioTrack) appState.audioTrack.pause();

  if (appState.recordedAudioUrl) {
    const parentAudio = new Audio(appState.recordedAudioUrl);
    appState.isPlayingAudio = true;
    document.getElementById('play-btn').innerText = "⏸";
    document.getElementById('player-subtitle').innerText = "🎙 Озвучивание записанным голосом родителя!";

    parentAudio.play().catch(err => {
      console.warn("Parent recorded audio play error:", err);
      playMP3AudioTrack(true);
    });

    parentAudio.onended = () => {
      appState.isPlayingAudio = false;
      document.getElementById('play-btn').innerText = "▶";
    };
  } else {
    alert("🎙 Вы еще не записали свой голос! Нажмите микрофон слева для записи отрывка вашего голоса.");
    playMP3AudioTrack(true);
  }
}

function playMP3AudioTrack(forceStart = false) {
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  if (!appState.audioTrack) {
    initAudioPlayer();
  }

  if (forceStart) {
    appState.audioTrack.currentTime = 0;
    appState.audioTrack.play().then(() => {
      appState.isPlayingAudio = true;
      document.getElementById('play-btn').innerText = "⏸";
    }).catch(err => {
      console.warn("MP3 playback fallback to speech synth:", err);
      const text = document.getElementById('meditation-text-box').innerText;
      speakTextTTS(text);
    });
    return;
  }

  if (appState.isPlayingAudio) {
    appState.audioTrack.pause();
    appState.isPlayingAudio = false;
    document.getElementById('play-btn').innerText = "▶";
  } else {
    appState.audioTrack.play().then(() => {
      appState.isPlayingAudio = true;
      document.getElementById('play-btn').innerText = "⏸";
    }).catch(err => {
      console.warn("MP3 playback fallback to speech synth:", err);
      const text = document.getElementById('meditation-text-box').innerText;
      speakTextTTS(text);
    });
  }
}

function playQuickTestAudio() {
  const playerCard = document.querySelector('.player-card') || document.getElementById('generator');
  if (playerCard) {
    playerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  playMP3AudioTrack(true);
  logClickAnalytics('QuickTestAudio_Clicked', 'Hero Quick Test Button', 0);
}

function togglePlayAudio() {
  if (appState.isPlayingAudio) {
    if (appState.audioTrack) appState.audioTrack.pause();
    if (window.speechSynthesis) window.speechSynthesis.pause();
    appState.isPlayingAudio = false;
    document.getElementById('play-btn').innerText = "▶";
  } else {
    if (appState.audioTrack && appState.audioTrack.currentTime > 0) {
      playMP3AudioTrack(false);
    } else {
      generatePersonalMeditation();
    }
  }
}

function speakTextTTS(text) {
  if (appState.audioTrack) appState.audioTrack.pause();
  if (!window.speechSynthesis) {
    playMP3AudioTrack(true);
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.6;
  utterance.pitch = 0.75;
  utterance.lang = appState.lang === 'he' ? 'he-IL' : 'ru-RU';

  utterance.onstart = () => {
    appState.isPlayingAudio = true;
    document.getElementById('play-btn').innerText = "⏸";
  };

  utterance.onend = () => {
    appState.isPlayingAudio = false;
    document.getElementById('play-btn').innerText = "▶";
  };

  window.speechSynthesis.speak(utterance);
}

function generateEmergencyAudio() {
  const contextInput = document.getElementById('emergency-context').value || "Ребенок растревожен";
  const name = document.getElementById('child-name').value || "Ребенок";

  const emergencyScript = `
    ${name}, сделай глубокий выдох вместе со мной... Один... два... три... 
    Я знаю, что ситуация: "${contextInput}" вызывает много эмоций. 
    Но сейчас ты находишься в полной безопасности.
  `;

  document.getElementById('meditation-text-box').innerHTML = `<p><strong>🚨 ЭКСТРЕННОЕ АУДИО ЗАЗЕМЛЕНИЯ:</strong><br><br>${emergencyScript}</p>`;
  playMP3AudioTrack();
  logClickAnalytics('EmergencyAudio_Generated', contextInput, 0);
}

function initSignatureCanvas() {
  appState.signatureCanvas = document.getElementById('signature-canvas');
  if (!appState.signatureCanvas) return;

  const canvas = appState.signatureCanvas;

  // Set internal resolution matching bounding rect
  const rect = canvas.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    canvas.width = rect.width;
    canvas.height = rect.height;
  } else {
    canvas.width = 400;
    canvas.height = 140;
  }

  const ctx = canvas.getContext('2d');
  appState.signatureCtx = ctx;

  ctx.strokeStyle = '#0F172A'; // Dark stroke on white canvas
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (canvas.getAttribute('data-initialized') === 'true') return;
  canvas.setAttribute('data-initialized', 'true');

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const scaleX = canvas.width / r.width;
    const scaleY = canvas.height / r.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - r.left) * scaleX,
      y: (clientY - r.top) * scaleY
    };
  }

  function startDrawing(e) {
    e.preventDefault();
    appState.isDrawingSignature = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!appState.isDrawingSignature) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    appState.hasSignature = true;
    const sigStatus = document.getElementById('sig-status');
    if (sigStatus) {
      sigStatus.style.color = '#22C55E';
      sigStatus.innerText = '✍️ Подпись поставлена';
    }
  }

  function stopDrawing(e) {
    if (appState.isDrawingSignature) {
      appState.isDrawingSignature = false;
      ctx.closePath();
    }
  }

  // Mouse event listeners
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Touch event listeners (mobile/tablet)
  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDrawing, { passive: false });
  canvas.addEventListener('touchcancel', stopDrawing, { passive: false });
}

function clearSignatureCanvas() {
  if (appState.signatureCtx && appState.signatureCanvas) {
    appState.signatureCtx.clearRect(0, 0, appState.signatureCanvas.width, appState.signatureCanvas.height);
    appState.hasSignature = false;
    const sigStatus = document.getElementById('sig-status');
    if (sigStatus) {
      sigStatus.style.color = 'var(--text-muted)';
      sigStatus.innerText = 'Подпись пуста';
    }
  }
}

function openNDAModal() {
  const modal = document.getElementById('nda-modal');
  if (modal) modal.classList.remove('hidden');
  setTimeout(() => {
    initSignatureCanvas();
  }, 50);
  logClickAnalytics('NDAModal_Opened', 'NDA_Form', 0);
}

function closeNDAModal() {
  const modal = document.getElementById('nda-modal');
  if (modal) modal.classList.add('hidden');
}

async function submitNDASignature() {
  const name = document.getElementById('nda-user-name').value || 'Анонимный Подписант';
  const contact = document.getElementById('nda-user-contact')?.value.trim() || '';
  const email = document.getElementById('nda-user-email')?.value.trim() || '';

  if (!contact) {
    alert("⚠️ Пожалуйста, укажите ваш номер WhatsApp или Telegram для продолжения!");
    return;
  }

  localStorage.setItem('ndaSigned', 'true');
  alert(`🎉 Соглашение успешно подписано!\nПодписант: ${name}`);
  closeNDAModal();

  logClickAnalytics('NDA_Signed', name, 0, {
    user_name: name,
    contact: contact,
    email: email,
    phone: contact
  });

  if (appState.pendingCheckout) {
    appState.pendingCheckout = false;
    document.getElementById('checkout-plan-name').innerText = appState.selectedPlan;
    document.getElementById('checkout-plan-price').innerText = `$${appState.selectedPrice}`;
    document.getElementById('checkout-modal').classList.remove('hidden');
  }
}

function openCustDevModal() {
  document.getElementById('custdev-modal').classList.remove('hidden');
  logClickAnalytics('CustDevModal_Opened', 'CustDev', 0);
}

function closeCustDevModal() {
  document.getElementById('custdev-modal').classList.add('hidden');
}

function selectCustDevScenario(scenarioKey) {
  appState.currentCustDevScenario = scenarioKey;
  document.querySelectorAll('.custdev-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`cd-btn-${scenarioKey}`);
  if (activeBtn) activeBtn.classList.add('active');
}

function handleCustDevSubmit(e) {
  e.preventDefault();
  alert("🎉 Спасибо за ваши ответы! Вам предоставлен приоритетный VIP-доступ.");
  closeCustDevModal();
}

/* ==========================================================================
   Pricing Card Billing Toggle Handler (Individual Card Scoped)
   ========================================================================== */
function setCardBilling(btnEl, planName, cycle) {
  const isAnnual = (cycle === 'annual');
  const card = btnEl ? btnEl.closest('.pricing-card') : null;

  if (card) {
    const monthlyBtn = card.querySelector('.btn-monthly');
    const annualBtn  = card.querySelector('.btn-annual');
    if (isAnnual) {
      if (annualBtn)  annualBtn.classList.add('active');
      if (monthlyBtn) monthlyBtn.classList.remove('active');
    } else {
      if (monthlyBtn) monthlyBtn.classList.add('active');
      if (annualBtn)  annualBtn.classList.remove('active');
    }

    const priceEl = card.querySelector('.plan-price');
    const subtextEl = card.querySelector('.annual-subtext');

    if (planName === 'Basic') {
      if (isAnnual) {
        if (priceEl) priceEl.innerHTML = "$29.99 <span>/ год</span>";
        if (subtextEl) subtextEl.classList.remove('hidden');
      } else {
        if (priceEl) priceEl.innerHTML = "$7 <span>/ месяц</span>";
        if (subtextEl) subtextEl.classList.add('hidden');
      }
    } else if (planName === 'Premium') {
      if (isAnnual) {
        if (priceEl) priceEl.innerHTML = "$59.99 <span>/ год</span>";
        if (subtextEl) subtextEl.classList.remove('hidden');
      } else {
        if (priceEl) priceEl.innerHTML = "$14.99 <span>/ месяц</span>";
        if (subtextEl) subtextEl.classList.add('hidden');
      }
    } else if (planName === 'Platinum') {
      if (isAnnual) {
        if (priceEl) priceEl.innerHTML = "$99.99 <span>/ год</span>";
        if (subtextEl) subtextEl.classList.remove('hidden');
      } else {
        if (priceEl) priceEl.innerHTML = "$24.99 <span>/ месяц</span>";
        if (subtextEl) subtextEl.classList.add('hidden');
      }
    }
  }

  if (!appState.cardBillingState) appState.cardBillingState = {};
  appState.cardBillingState[planName] = isAnnual;

  logClickAnalytics('CardBillingCycle_Toggled', planName + '_' + (isAnnual ? 'Annual' : 'Monthly'), 0);
}

function selectPlan(planName, price) {
  appState.selectedPlan = planName;
  const isAnnual = appState.cardBillingState ? appState.cardBillingState[planName] : false;
  let finalPrice = price;

  if (isAnnual && price > 0) {
    if (planName === 'Basic') finalPrice = 29.99;
    else if (planName === 'Premium') finalPrice = 59.99;
    else if (planName === 'Platinum') finalPrice = 99.99;
  }
  appState.selectedPrice = finalPrice;

  logClickAnalytics('TariffButton_Click', planName + (isAnnual ? '_Annual' : '_Monthly'), finalPrice);
  appState.pendingCheckout = true;
  openNDAModal();
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function handlePaymentSubmit(e) {
  e.preventDefault();
  alert(`🎉 Подписка "${appState.selectedPlan}" успешно активирована!`);
  closeCheckoutModal();
}

function openAuthModal(type = 'login') {
  appState.pendingAuthModal = type;
  openNDAModal();
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function simulateSocialAuth(provider) {
  alert(`🎉 Вход через ${provider} выполнен успешно!`);
  closeAuthModal();
}

function handleAuthSubmit(e) {
  e.preventDefault();
  closeAuthModal();
}

function logClickAnalytics(eventType, planName, priceAmount, extraData = {}) {
  const timeOnPage = Math.round((Date.now() - analyticsState.pageStartTime) / 1000);
  const payload = {
    timestamp: new Date().toLocaleString('ru-RU'),
    event_type: eventType,
    session_id: SESSION_ID,
    user_name: extraData.user_name || '-',
    email: extraData.email || '-',
    phone: extraData.phone || '-',
    plan_name: planName || '-',
    price: priceAmount || 0,
    language: appState.lang || 'ru',
    scroll_depth: analyticsState.maxScrollDepth,
    time_on_page: timeOnPage
  };

  fetch(supabaseUrl, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).catch(err => console.warn('Supabase analytics fetch error:', err));
}

function initAnalyticsTracking() {
  logClickAnalytics('Page_View', '-', 0, { section: 'hero' });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error:', err));
  }
}

// Global Window Binds
window.openNDAModal = openNDAModal;
window.closeNDAModal = closeNDAModal;
window.submitNDASignature = submitNDASignature;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.handleAuthSubmit = handleAuthSubmit;
window.openCustDevModal = openCustDevModal;
window.closeCustDevModal = closeCustDevModal;
window.handleCustDevSubmit = handleCustDevSubmit;
window.selectCustDevScenario = selectCustDevScenario;
window.selectPlan = selectPlan;
window.closeCheckoutModal = closeCheckoutModal;
window.handlePaymentSubmit = handlePaymentSubmit;
window.playQuickTestAudio = playQuickTestAudio;
window.selectAudioMode = selectAudioMode;
window.switchLanguage = switchLanguage;
window.scrollToSection = scrollToSection;
window.simulateSocialAuth = simulateSocialAuth;
window.generatePersonalMeditation = generatePersonalMeditation;
window.toggleVoiceRecord = toggleVoiceRecord;
window.clearSignatureCanvas = clearSignatureCanvas;
window.setCardBilling = setCardBilling;
window.toggleFullStoryText = toggleFullStoryText;
