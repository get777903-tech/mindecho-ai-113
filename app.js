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

// Internationalization Dictionary (RU, EN, HE)
const translations = {
  ru: {
    nav_mission: "Миссия",
    nav_modes: "Эмоциональная помощь",
    nav_generator: "Студия",
    nav_pricing: "Тарифы",
    nav_nda: "DISCLAIMER",
    nav_custdev: "🎁 Опрос + подарок",
    btn_login: "Войти",
    sticky_text: "Инвестируйте в гармонию семьи от $7/мес",
    btn_choose_plan: "Выбрать тариф",
    hero_badge: "ИИ + Детская Нейропсихология + КПТ/ACT + Эмоциональная безопасность",
    hero_title: "Превращаем родительскую рутину в <span class=\"text-gradient\">бережную психологическую поддержку</span>",
    hero_subtitle: "Экосистема эмоциональной безопасности семьи и превентивная психологическая поддержка детей родным голосом. Легальный способ сохранить эмоциональные ресурсы родителей и вырастить счастливого ребенка.",
    btn_try_free: "✨ Попробовать! Сказка для расслабления с голосом мамы, папы или бабушки",
    btn_try_free_sub: "мягко растворяет дневной стресс, снятие тревог и развитие эмоционального интеллекта (EQ) ребенка прямо в процессе засыпания .",
    btn_games: "🎮 Игры развивающие речь + эмоциональный интеллект",
    btn_prayer: "🙏 Создание молитвы-медитации",
    trust_privacy: "🛡 Privacy-First (Банковское шифрование)",
    trust_supervisor: "🧠 Валидировано Агентом-Супервизором",
    trust_global: "🌏 платформа для каждого и всего мира",
    hero_card_sub: "Самый родной и успокаивающий голос • Без музыки",
    hero_sample_quote: "\"Закрой глаза и обрати внимание на свой нос... Почувствуй тихую и спокойную радость внутри...\"",
    hero_card_footer: "✨ Персонализированный рассказ для расслабления",
    tag_supermission: "Супермиссия MindEcho AI",
    title_supermission: "Студия Медитации разработка на основе методов детской нейропсихологии",
    sub_supermission: "Мы создаем не просто IT проект, а самую защищенную экосистему для ментального здоровья и эмоциональной безопасности семей во всем мире.",
    m1_title: "1. платформа для каждого и всего мира",
    m1_desc: "Стираем социальное и экономическое неравенство. Платформа доступна даже для малоимущих семей — каждый ребенок имеет право на здоровое эмоциональное развитие. Контур психологической поддержки и развития EQ.",
    m2_title: "2. Гармония в семье и развитие эмоционального интеллекта",
    m2_desc: "Прогрессивные аудиорежимы и геймификация привычек исключают из жизни семьи истерики, упреки и обиды, мягко повышая эмоциональный интеллект (EQ) и укрепляя авторитет родителей.",
    m3_title: "3. Сбережение энергии родителей",
    m3_desc: "Защищаем родителей от выгорания, гарантируя 1–2 часа личного времени в день, а детей — от ментального перенапряжения, сохраняя силы для искренней радости и живого общения на основе практик развивающей нейропсихологии. Одобрено детскими нейропсихологами",
    m3_tag: "Освобождение 1-2 часа личного времени на основе практик развивающей нейропсихологии ",
    m4_title: "4. Развитие эмоционального интеллекта (EQ)",
    m4_desc: "Мягко снимаем дневной стресс, тревоги и обиды ребенка прямо в процессе засыпания, программируя его на абсолютную уверенность в себе и психологическую устойчивость.",
    m4_tag: "CBT & ACT Framework. Нейропсихологический подход к эмоциональной саморегуляции ребенка",
    btn_quick_test: "▶️ Быстрое тестирование рассказа-медитации (Включить аудио)",
    mic_story_reader_title: "📖 Текст для чтения вслух при записи (читать медленно с паузами):",
    btn_toggle_story_text: "Развернуть весь текст 📖",
    btn_toggle_story_text_collapse: "Свернуть текст 🔼",
    story_snippet_text: "«Знай что мама и папа тебя очень любят… А теперь давай отправимся в дружелюбное местечко… Представь, что у тебя в голове есть такое место,… где тебе хорошо…»",
    story_full_text: "«Знай что мама и папа тебя очень любят …А теперь давай отправимся в дружелюбное местечко.… Представь, что у тебя в голове есть такое место,… где тебе хорошо.… Найди его и побудь там.… Представь самое красивое и безопасное место, которое ты можешь вообразить.… где мама и папа всегда рядом с тобой и помогают тебе.…<br><br>…Потому что это тот мир, который ты построила сама и в котором все, во что ты веришь — это правда. Это тот самый мир, где все действительно сбывается, …где мысли становятся реальными и где все, во что ты веришь, может случиться. …Думай о том, что в этом месте ты — настоящая волшебница и всё подвластно твоей воле.…<br><br>…Поверь в то, что ты умна, и что ты очень быстро и легко учишься. Поверь в это, и всё сбудется. Почувствуй уверенность в своих силах, думай о том, как легко тебе даются любые новые знания.<br><br>Поверь в то, что тебя очень сильно любят, и почувствуй это всем своим сердцем, и пусть душа наполнится счастьем. Представь теплое сияние в груди, вдыхай это чувство любви каждой клеточкой, ... мама и папа рады что ты у них есть...»",
    tag_modes: "Быстрый запуск позитивных изменений",
    title_modes: "4 Специализированных Режима Эмоциональной Помощи и Поддержки",
    sub_modes: "Выберите требуемый сценарий для мгновенной генерации сказки для расслабления или помощи",
    mode_morning_title: "Утренняя настройка",
    mode_morning_desc: "Заряд бодрости, веры в свои силы, лёгкости в учебе и радости перед новым днем.",
    btn_start_morning: "Запустить утренний настрой",
    mode_bedtime_title: "Сказка перед сном",
    mode_bedtime_desc: "Мягкий уход в сон, снятие дневных обид, растворение тревог и выработка глубинного покоя.",
    btn_start_bedtime: "Запустить режим расслабления перед сном",
    mode_prayer_title: "Молитва-медитация",
    mode_prayer_desc: "Духовный покой, благодарность, умиротворение и благословение светлого настроя для семьи.",
    btn_start_prayer: "Включить Молитву-Медитацию",
    mode_emergency_title: "Экстренная помощь при истерике",
    mode_emergency_desc: "Мгновенный 4-шаговый алгоритм для родителя + экспресс-генерация аудио для заземления ребенка.",
    btn_start_emergency: "🚨 Активировать скорую помощь",
    em_header: "🚨 Экстренный протокол: Помощь при истерике",
    em_step1_title: "Ваша выдержка",
    em_step1_desc: "Сделайте глубокий вдох. Вы — спокойный якорь безопасности для ребенка.",
    em_step2_title: "Безопасность",
    em_step2_desc: "Уберите острое, снизьте громкость голоса, присядьте на уровень глаз ребенка.",
    em_step3_title: "Легализация",
    em_step3_desc: "Тихо скажите: «Я вижу, что тебе очень тяжело и ты злишься. Я рядом».",
    em_step4_title: "Заземление",
    em_step4_desc: "Включите успокаивающее ИИ-аудио и дайте ребенку почувствовать ритм дыхания.",
    em_input_label: "Опишите в чем смысл ситуации (что произошло?):",
    btn_gen_emergency: "✨ Сгенерировать экспресс-аудио",
    tag_studio: "Студия Медитации - разработка на основе методов детской нейропсихологии",
    title_studio: "Персональный Рассказ-Медитация",
    sub_studio: "Запись вашего голоса + Студийная MP3 фонограмма + Динамическая ИИ-озвучка",
    label_child_name: "Имя ребенка:",
    label_child_gender: "Пол ребенка:",
    opt_girl: "Девочка",
    opt_boy: "Мальчик",
    label_child_age: "Возраст (лет):",
    label_audio_source: "Источник аудио-озвучки:",
    opt_source_parent: "🎙 голос папы или мамы",
    opt_source_mp3: "🎵 Студийная MP3 фонограмма",
    opt_source_tts: "🤖 Динамический ИИ-диктор (Низкий тембр)",
    label_voice_timbre: "Тембр и Голос озвучки:",
    opt_male_deep: "🎙 мужской - низкий спокойный голос",
    opt_female_calm: "🎙 женский спокойный голос",
    opt_generated_parent: "🎙 сгенерированный голос мамы или папы",
    label_meditation_mode: "Режим рассказа-медитации:",
    opt_mode_bedtime: "🌙 Перед сном (Засыпание)",
    opt_mode_morning: "☀️ Утренняя (Уверенность)",
    opt_mode_emergency: "🚨 Экстренная (Заземление)",
    opt_mode_prayer: "🙏 Молитва-медитация (Духовный покой)",
    label_mic_rec: "🎙 Запись голоса (до 30 сек для ElevenLabs):",
    mic_press_text: "Нажмите для записи голоса родителя или бабушки (до 30 сек)",
    btn_generate: "✨ Создать рассказ-медитацию с голосом мамы, папы или бабушки",
    player_title_default: "Рассказ-Медитация",
    player_sub_default: "Самый родной и успокаивающий голос • Без музыки",
    tag_pricing: "Прозрачная монетизация",
    title_pricing: "Выберите Тариф Подписки",
    sub_pricing: "Freemium доступ + Лимиты генерации + Докупка минут",
    plan_title_free: "Free (Базовый)",
    plan_free_sub: "Ощутить ценность сервиса",
    plan_forever: "/ навсегда",
    pf_free_1: "✅ 2 AI-запроса в день",
    pf_free_2: "✅ Стандартный рассказ-медитация",
    pf_free_3: "✅ Озвучка спокойным приятным голосом",
    pf_free_3_extra: "✅ Нейрогимнастика и упражнения для баланса эмоций",
    pf_free_3_emergency: "✅ Экстренная помощь при истерике",
    pf_free_4: "❌ Нет сохранения истории",
    btn_plan_free: "Начать бесплатно",
    plan_title_basic: "Базовый",
    plan_basic_sub: "Для ежедневных подстроек",
    billing_monthly: "Ежемесячно",
    billing_annual: "Оплата за год <span class=\"discount-badge\">-67% Скидка</span>",
    plan_per_month: "/ месяц",
    pf_basic_1: "✅ 50 минут генераций в месяц",
    pf_basic_2: "✅ Персонализация под имя ребенка",
    pf_basic_3: "✅ Поддержка 3 языков (RU, EN, HE)",
    pf_basic_4: "✅ Сохранение истории голосов и рассказов",
    btn_plan_basic: "Выбрать Базовый",
    popular_badge: "🔥 Популярный выбор",
    plan_title_premium: "Премиум",
    plan_premium_sub: "Полный покой и гармония семьи",
    pf_prem_1: "✅ 120 минут генераций (~12 медитаций)",
    pf_prem_2: "✅ Экстренная помощь при истерике",
    pf_prem_3: "✅ Семейный доступ до 4 устройств",
    pf_prem_4: "✅ Приоритетная поддержка",
    btn_plan_premium: "Активировать Премиум",
    plan_title_platinum: "Платиновый",
    plan_plat_sub: "Максимальный ресурс и поддержка",
    pf_plat_1: "✅ 300 минут генерации аудио",
    pf_plat_2: "✅ Неограниченная библиотека медитаций",
    pf_plat_3: "✅ Персональный Агент-Супервизор",
    pf_plat_4: "✅ Семейный доступ до 8 устройств",
    btn_plan_platinum: "Активировать Платиновый",
    topup_tag: "⚡ Дополнительные минуты:",
    topup_title: "Пакет «Еще 50 минут медитаций»",
    topup_desc: "Закончился лимит подписки? Докупите 50 минут без смены тарифного плана.",
    btn_topup: "Докупить за $4.99",
    nda_title: "📜 Пользовательское соглашение (Terms of Service)",
    nda_sub: "ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ И ОГРАНИЧЕНИЕ ПРЕТЕНЗИЙ (DISCLAIMER)",
    label_nda_name: "Ваше ФИО Подписанта:",
    label_auth_phone: "WhatsApp / Telegram (Обязательно):",
    label_nda_email: "Ваш E-mail адрес:",
    label_signature_canvas: "✍️ Поставьте подпись мышкой или пальцем ниже:",
    btn_clear_sig: "Очистить",
    btn_submit_nda: "✅ Принять и подписать NDA (Перейти к документу)",
    custdev_modal_title: "💬 Опрос + подарок: Помогите сделать продукт лучше",
    custdev_modal_sub: "Выберите интересующий вас сценарий, ответьте на 3 вопроса и получите свой подарок:",
    cd_btn_burnout: "🟢 1. Выгорание",
    cd_btn_tantrums: "🔵 2. Истерики",
    cd_btn_confidence: "🟡 3. Уверенность",
    cd_btn_expert: "🟣 4. Эксперт",
    btn_submit_custdev: "🚀 Отправить ответы и получить подарок",
    modal_auth_title: "Вход в MindEcho AI",
    modal_auth_sub: "Сохраните настройки медитаций и статистику",
    btn_auth_google: "Вход через аккаунт Google",
    btn_auth_apple: "Вход через Apple ID",
    label_terms_agree: "Я согласен с Условиями использования и политикой конфиденциальности.",
    btn_auth_submit: "Войти / Зарегистрироваться",
    footer_brand_desc: "Глобальная инклюзивная экосистема для защиты ментального здоровья семей. ИИ, детская нейропсихология и КПТ.",
    footer_nav_title: "Навигация",
    legal_terms: "Условия использования",
    copyright_text: "© 2026 MindEcho AI Inc. Все права защищены."
  },
  en: {
    nav_mission: "Mission",
    nav_modes: "Emotional Support",
    nav_generator: "Studio",
    nav_pricing: "Pricing",
    nav_nda: "DISCLAIMER",
    nav_custdev: "🎁 Survey + Gift",
    btn_login: "Sign In",
    sticky_text: "Invest in family harmony from $7/mo",
    btn_choose_plan: "Choose Plan",
    hero_badge: "AI + Child Neuropsychology + CBT/ACT + Emotional Safety",
    hero_title: "Transforming parenting routine into <span class=\"text-gradient\">gentle psychological support</span>",
    hero_subtitle: "Family emotional safety ecosystem & preventive psychological support for children in a native voice. A legal way to save parents' resources and raise a happy child.",
    btn_try_free: "✨ Try it! Relaxation story with Mom's, Dad's, or Grandma's voice",
    btn_try_free_sub: "gently dissolves daytime stress, alleviates anxiety, and develops child's emotional intelligence (EQ) right during bedtime .",
    btn_games: "🎮 Speech development & Emotional Intelligence games",
    btn_prayer: "🙏 Create Prayer-Meditation",
    trust_privacy: "🛡 Privacy-First (Bank-grade encryption)",
    trust_supervisor: "🧠 Validated by Supervisor AI Agent",
    trust_global: "🌏 Platform for everyone worldwide",
    hero_card_sub: "Native soothing voice • No background music",
    hero_sample_quote: "\"Close your eyes and focus on your breathing... Feel quiet and calm joy inside...\"",
    hero_card_footer: "✨ Personalized relaxation story",
    tag_supermission: "MindEcho AI Super-Mission",
    title_supermission: "Meditation Studio - developed based on child neuropsychology methods",
    sub_supermission: "We create not just an IT project, but the safest ecosystem for family mental wellness and emotional security worldwide.",
    m1_title: "1. Platform for everyone worldwide",
    m1_desc: "Erasing social and economic inequality. Accessible even for low-income families — every child deserves healthy emotional development.",
    m2_title: "2. Family harmony & emotional intelligence development",
    m2_desc: "Progressive audio modes and habit gamification eliminate tantrums, boosting emotional intelligence (EQ) and strengthening parents' authority.",
    m3_title: "3. Saving parents' energy",
    m3_desc: "Protecting parents from burnout with 1-2 hours of personal time daily, and children from mental stress based on developmental neuropsychology. Approved by child neuropsychologists.",
    m3_tag: "1-2 hours of personal time based on developmental neuropsychology",
    m4_title: "4. Emotional Intelligence (EQ) Development",
    m4_desc: "Gently relieving daytime stress, anxieties, and grievances during bedtime, fostering self-confidence and psychological resilience.",
    m4_tag: "CBT & ACT Framework. Neuropsychological approach to child emotional self-regulation",
    btn_quick_test: "▶️ Quick Meditation Story Test (Play Audio)",
    mic_story_reader_title: "📖 Text for reading aloud while recording (read slowly with pauses):",
    btn_toggle_story_text: "Expand full text 📖",
    btn_toggle_story_text_collapse: "Collapse text 🔼",
    story_snippet_text: "“Know that Mom and Dad love you very much… Now let’s go to a friendly little place… Imagine there is a place in your mind… where you feel so good…”",
    story_full_text: "“Know that Mom and Dad love you very much… Now let’s go to a friendly little place… Imagine there is    custdev_modal_title: "💬 Survey + Gift: Help us improve MindEcho AI",
    custdev_modal_sub: "Choose a scenario, answer 3 questions, and claim your gift:",
    cd_btn_burnout: "🟢 1. Burnout",
    cd_btn_tantrums: "🔵 2. Tantrums",
    cd_btn_confidence: "🟡 3. Confidence",
    cd_btn_expert: "🟣 4. Expert",
    btn_submit_custdev: "🚀 Submit answers & get gift",
    modal_auth_title: "Sign In to MindEcho AI",
    modal_auth_sub: "Save your meditation settings and progress",
    btn_auth_google: "Sign in with Google",
    btn_auth_apple: "Sign in with Apple ID",
    label_terms_agree: "I agree to Terms of Service and Privacy Policy.",
    btn_auth_submit: "Sign In / Register",
    footer_brand_desc: "Global inclusive ecosystem for family mental wellness. AI, child neuropsychology, and CBT.",
    footer_nav_title: "Navigation",
    legal_terms: "Terms of Use",
    copyright_text: "© 2026 MindEcho AI Inc. All rights reserved."
  },
  he: {
    nav_mission: "משימה",
    nav_modes: "תמיכה רגשית",
    nav_generator: "סטודיו",
    nav_pricing: "מחירון",
    nav_nda: "הצהרה",
    nav_custdev: "🎁 סקר + מתנה",
    btn_login: "התחברות",
    sticky_text: "השקיעו בהרמוניה משפחתית החל מ-$7 לחודש",
    btn_choose_plan: "בחר מסלול",
    hero_badge: "בינה מלאכותית + נוירופסיכולוגיה של הילד + CBT/ACT + בטיחות רגשית",
    hero_title: "הופכים את שגרת ההורות ל<span class=\"text-gradient\">תמיכה פסיכולוגית עדינה</span>",
    hero_subtitle: "מערכת אקולוגית לבטיחות רגשית של המשפחה ותמיכה פסיכולוגית מונעת לילדים בקול מוקלט. דרך חוקית לשמור על משאבי ההורים ולגדל ילד מאושר.",
    btn_try_free: "✨ נסו עכשיו! סיפור הרגעה בקולם של אמא, אבא או סבתא",
    btn_try_free_sub: "מפיג בעדינות מתח יומי, מפיג חרדות ומפתח את האינטליגנציה הרגשית (EQ) של הילד ישירות בזמן ההרדמה .",
    btn_games: "🎮 משחקים לפיתוח דיבור ואינטליגנציה רגשית",
    btn_prayer: "🙏 יצירת מדיטציית תפילה",
    trust_privacy: "🛡 פרטיות תחילה (הצפנה בנקאית)",
    trust_supervisor: "🧠 מאומת על ידי סוכן מפקח AI",
    trust_global: "🌏 פלטפורמה לכולם ברחבי העולם",
    hero_card_sub: "קול מרגיע ומוכר • ללא מוזיקת רקע",
    hero_sample_quote: "\"עצום עיניים והתמקד בנשימה שלך... חוש שמחה שקטה ורגועה מבפנים...\"",
    hero_card_footer: "✨ סיפור הרגעה מותאם אישית",
    tag_supermission: "סופר-משימה של MindEcho AI",
    title_supermission: "סטודיו למדיטציה - פיתוח המבוסס על שיטות נוירופסיכולוגיה של הילד",
    sub_supermission: "אנו יוצרים לא רק פרויקט IT, אלא את המערכת האקולוגית המוגנת ביותר לבריאות נפשית ובטיחות רגשית של משפחות בעולם.",
    m1_title: "1. פלטפורמה לכולם ברחבי העולם",
    m1_desc: "מחיקת אי-שוויון חברתי וכלכלי. נגיש גם למשפחות בסיכון — לכל ילד מגיעה התפתחות רגשית בריאה.",
    m2_title: "2. הרמוניה במשפחה ופיתוח אינטליגנציה רגשית",
    m2_desc: "מצבי שמע מתקדמים и משחוק הרגלים מעלימים התקפי זעם, מחזקים אינטליגנציה רגשית (EQ) ומחזקים את סמכות ההורים.",
    m3_title: "3. חיסכון באנרגיה של ההורים",
    m3_desc: "הגנה על ההורים משחיקה עם 1-2 שעות של זמן אישי ביום, והגנה על ילדים ממתח נפשי מבוסס נוירופסיכולוגיה התפתחותית. אושר על ידי נוירופסיכולוגים לילדים.",
    m3_tag: "1-2 שעות זמן אישי מבוסס נוירופסיכולוגיה התפתחותית",
    m4_title: "4. פיתוח אינטליגנציה רגשית (EQ)",
    m4_desc: "הפחתה עדינה של מתח יומי, חרדות וכעסים בזמן השינה, בניית ביטחון עצמי וחוסן נפשי.",
    m4_tag: "מסגרת CBT & ACT. גישה נוירופסיכולוגית לוויתור ואיזון רגשי של הילד",
    btn_quick_test: "▶️ בדיקה מהירה של סיפור המדיטציה (הפעל שמע)",
    mic_story_reader_title: "📖 טקסט לקריאה בקול בזמן ההקלטה (לקרוא לאט עם הפסקות):",
    btn_toggle_story_text: "השתרע את כל הטקסט 📖",
    btn_toggle_story_text_collapse: "צמצם טקסט 🔼",
    story_snippet_text: "“דע שאמא ואבא אוהבים אותך מאוד… עכשיו בוא נצא למקום ידידותי… דמיין שיש מקום כזה בראשך… שבו טוב לך…”",
    story_full_text: "“דע שאמא ואבא אוהבים אותך מאוד… עכשיו בוא נצא למקום ידידותי… דמיין שיש מקום כזה בראשך… שבו טוב לך… מצא אותו והישאר שם קצת… דמיין את המקום היפה והבטוח ביותר שאתה יכול לדמיין… שבו אמא ואבא תמיד לצידך ועוזרים לך…<br><br>…כי זה העולם שבנית בעצצמך, שבו כל מה שאתה מאמין בו הוא אמת. זה העולם שבו הכל באמת מתגשם… שבו מחשבות הופכות למציאות ושבו כל מה שאתה מאמין בו יכול לקרות… חשוב על כך שבמקום הזה אתה קוסם אמיתי וכל הרצונות שלך מתגשמים…<br><br>…האמן שאתה חכם, ושאתה לומד מהר מאוד ובקלות. האמן בזה, והכל יתגשם. חוש ביטחון בכוחותיך, חשוב על כך שכל ידע חדש מגיע אליך בקלות.<br><br>האמן שאוהבים אותך מאוד עמוק, חוש זאת בכל ליבך, ותן לנשמה שלך להתמלא באושר. דמיין זוהר חם בחזה, נשום את תחושת האהבה הזו בכל תא, ... אמא ואבא שמחים כל כך שיש להם אותך…”",
    tag_modes: "הפעלה מהירה של שינויים חיוביים",
    title_modes: "4 מצבים מיוחדים לעזרה ותמיכה רגשית",
    sub_modes: "בחרו תרחיש ליצירה מיידית של סיפורי הרגעה או עזרה דחופה",
    mode_morning_title: "כוון בוקר",
    mode_morning_desc: "זריקת מרץ, אמונה עצמית, קלות בלימודים ושמחה לקראת יום חדש.",
    btn_start_morning: "הפעל כוון בוקר",
    mode_bedtime_title: "סיפור לפני השינה",
    mode_bedtime_desc: "מעבר עדין לשינה, שחרור מועקות יומיות וטיפוח שלווה עמוקה.",
    btn_start_bedtime: "הפעל מצב הרגעה לפני השינה",
    mode_prayer_title: "מדיטציית תפילה",
    mode_prayer_desc: "שלווה רוחנית, הודיה, רוגע וברכה של הלך רוח מואר למשפחה.",
    btn_start_prayer: "הפעל מדיטציית תפילה",
    mode_emergency_title: "עזרה דחופה בזמן התקף זעם",
    mode_emergency_desc: "אלגוריתם 4 שלבים מיידי להורה + יצירת שמע AI מהירה לקרקוע הילד.",
    btn_start_emergency: "🚨 הפעל עזרה דחופה",
    em_header: "🚨 פרוטוקול חירום: תמיכה בזמן התקף זעם",
    em_step1_title: "איפוק ושליטה",
    em_step1_desc: "קחו נשימה עמוקה. אתם עוגן רגוע של ביטחון עבור ילדכם.",
    em_step2_title: "בטיחות תחילה",
    em_step2_desc: "הנמיכו את הקול, הרחיקו חפצים חדים, רדו לגובה העיניים של הילד.",
    em_step3_title: "תיקוף רגשי",
    em_step3_desc: "אמרו בשקט: 'אני רואה שקשה לך עכשיו ואתה כועס. אני כאן איתך.'",
    em_step4_title: "קרקוע",
    em_step4_desc: "הפעילו שמע מרגיע של AI והנחו את הילד לקצב נשימה סדיר.",
    em_input_label: "תארו את הסיטואציה (מה קרה?):",
    btn_gen_emergency: "✨ צור שמע מהיר",
    tag_studio: "סטודיו למדיטציה - פיתוח המבוסס על שיטות נוירופסיכולוגיה של הילד",
    title_studio: "סיפור מדיטציה מותאם אישית",
    sub_studio: "הקלטת קולכם + רצועת MP3 באולפן + קריינות AI דינמית",
    label_child_name: "שם הילד/ה:",
    label_child_gender: "מין הילד/ה:",
    opt_girl: "ילדה",
    opt_boy: "ילד",
    label_child_age: "גיל (בשנים):",
    label_audio_source: "מקור הקריינות:",
    opt_source_parent: "🎙 קול של אמא או אבא",
    opt_source_mp3: "🎵 רצועת MP3 אולפנית",
    opt_source_tts: "🤖 קריין AI דינמי (קול עמוק)",
    label_voice_timbre: "גון וסגנון הקול:",
    opt_male_deep: "🎙 גברי - קול עמוק ורגוע",
    opt_female_calm: "🎙 נשי - קול רגוע",
    opt_generated_parent: "🎙 קול הורה מחולל",
    label_meditation_mode: "מצב מדיטציה:",
    opt_mode_bedtime: "🌙 לפני השינה (הרדמה)",
    opt_mode_morning: "☀️ בוקר (ביטחון עצמי)",
    opt_mode_emergency: "🚨 חירום (קרקוע)",
    opt_mode_prayer: "🙏 מדיטציית תפילה (שלווה רוחנית)",
    label_mic_rec: "🎙 הקלטת קול (עד 30 שניות):",
    mic_press_text: "לחץ להקלטת קול של הורה או סבתא (עד 30 שניות)",
    btn_generate: "✨ צור סיפור מדיטציה בקול של אמא, אבא או סבתא",
    player_title_default: "סיפור מדיטציה",
    player_sub_default: "קול מרגיע ומוכר • ללא מוזיקה",
    tag_pricing: "מונטיזציה שקופה",
    title_pricing: "בחרו מסלול מנוי",
    sub_pricing: "גישת Freemium + מכסות יצירה + תוספת דקות",
    plan_title_free: "חינם (בסיסי)",
    plan_free_sub: "להרגיש את ערך השירות",
    plan_forever: "/ לתמיד",
    pf_free_1: "✅ 2 בקשות AI ביום",
    pf_free_2: "✅ סיפור מדיטציה סטנדרטי",
    pf_free_3: "✅ קריינות בקול רגוע ונעים",
    pf_free_3_extra: "✅ נוירוגימנסטיקה ותרגילים לאיזון רגשי",
    pf_free_3_emergency: "✅ עזרה דחופה בזמן התקף זעם",
    pf_free_4: "❌ ללא שמירת היסטוריה",
    btn_plan_free: "התחל בחינם",
    plan_title_basic: "בסיסי",
    plan_basic_sub: "לכוונים יומיומיים",
    billing_monthly: "חודשי",
    billing_annual: "תשלום שנתי <span class=\"discount-badge\">-67% הנחה</span>",
    plan_per_month: "/ חודש",
    pf_basic_1: "✅ 50 דקות יצירה בחודש",
    pf_basic_2: "✅ התאמה אישית לשם הילד",
    pf_basic_3: "✅ תמיכה ב-3 שפות (RU, EN, HE)",
    pf_basic_4: "✅ שמירת היסטוריית קולות וסיפורים",
    btn_plan_basic: "בחר בסיסי",
    popular_badge: "🔥 הבחירה הפופולרית",
    plan_title_premium: "פרימיום",
    plan_premium_sub: "שלווה מלאה והרמוניה משפחתית",
    pf_prem_1: "✅ 120 דקות יצירה (~12 סיפורים)",
    pf_prem_2: "✅ תמיכה בזמן התקפי זעם",
    pf_prem_3: "✅ גישה משפחתית עד 4 מכשירים",
    pf_prem_4: "✅ תמיכה בסדר עדיפויות",
    btn_plan_premium: "הפעל פרימיום",
    plan_title_platinum: "פלטינום",
    plan_plat_sub: "מקסימום משאבים ותמיכת VIP",
    pf_plat_1: "✅ 300 דקות יצירת שמע",
    pf_plat_2: "✅ ספריית מדיטציות ללא הגבלה",
    pf_plat_3: "✅ סוכן מפקח אישי AI",
    pf_plat_4: "✅ גישה משפחתית עד 8 מכשירים",
    btn_plan_platinum: "הפעל פלטינום",
    topup_tag: "⚡ דקות נוספות:",
    topup_title: "חבילת 50 דקות נוספות",
    topup_desc: "הסתיימה המכסה? רכשו 50 דקות נוספות ללא שינוי מסלול המנוי.",
    btn_topup: "רכשו ב-$4.99",
    nda_title: "📜 תנאי שירות והסכם משתמש",
    nda_sub: "הצהרת ויתור והגבלת אחריות (DISCLAIMER)",
    label_nda_name: "שם מלא של החותם:",
    label_auth_phone: "WhatsApp / Telegram (חובה):",
    label_nda_email: "כתובת דוא\"ל:",
    label_signature_canvas: "✍️ חתום בעזרת העכבר או האצבע למטה:",
    btn_clear_sig: "נקה",
    btn_submit_nda: "✅ אישור וחתימה על NDA (המשך במסמך)",
    custdev_modal_title: "💬 סקר + מתנה: עזרו לנו לשפר את המוצר",
    custdev_modal_sub: "בחרו תרחיש, ענו על 3 שאלות וקבלו מתנה:",
    cd_btn_burnout: "🟢 1. שחיקה",
    cd_btn_tantrums: "🔵 2. התקפי זעם",
    cd_btn_confidence: "🟡 3. ביטחון עצמי",
    cd_btn_expert: "🟣 4. מומחה",
    btn_submit_custdev: "🚀 שלח תשובות וקבל מתנה",
    modal_auth_title: "התחברות ל-MindEcho AI",
    modal_auth_sub: "שמרו את הגדרות המדיטציה וההתקדמות שלכם",
    btn_auth_google: "התחברות עם Google",
    btn_auth_apple: "התחברות עם Apple ID",
    label_terms_agree: "אני מסכים לתנאי השימוש ומדיניות הפרטיות.",
    btn_auth_submit: "התחבר / הרשם",
    footer_brand_desc: "מערכת אקולוגית גלובלית לבריאות נפשית של המשפחה. בינה מלאכותית, נוירופסיכולוגיה ו-CBT.",
    footer_nav_title: "ניווט",
    legal_terms: "תנאי שימוש",
    copyright_text: "© 2026 MindEcho AI Inc. כל הזכויות שמורות."
  }�כל ילד מגיעה התפתחות רגשית בריאה.",
    m2_title: "2. הרמוניה במשפחה ופיתוח אינטליגנציה רגשית",
    m2_desc: "מצבי שמע מתקדמים ומשחוק הרגלים מעלימים התקפי זעם, מחזקים אינטליגנציה רגשית (EQ) ומחזקים את סמכות ההורים.",
    m3_title: "3. חיסכון באנרגיה של ההורים",
    m3_desc: "הגנה על ההורים משחיקה עם 1-2 שעות של זמן אישי ביום, והגנה על ילדים ממתח נפשי מבוסס נוירופסיכולוגיה התפתחותית. אושר על ידי נוירופסיכולוגים לילדים.",
    m3_tag: "1-2 שעות זמן אישי מבוסס נוירופסיכולוגיה התפתחותית",
    m4_title: "4. פיתוח אינטליגנציה רגשית (EQ)",
    m4_desc: "הפחתה עדינה של מתח יומי, חרדות וכעסים בזמן השינה, בניית ביטחון עצמי וחוסן נפשי.",
    m4_tag: "מסגרת CBT & ACT. גישה נוירופסיכולוגית לוויתור ואיזון רגשי של הילד",
    btn_quick_test: "▶️ בדיקה מהירה של סיפור המדיטציה (הפעל שמע)",
    mic_story_reader_title: "📖 טקסט לקריאה בקול בזמן ההקלטה (לקרוא לאט עם הפסקות):",
    btn_toggle_story_text: "השתרע את כל הטקסט 📖",
    btn_toggle_story_text_collapse: "צמצם טקסט 🔼",
    story_snippet_text: "“דע שאמא ואבא אוהבים אותך מאוד… עכשיו בוא נצא למקום ידידותי… דמיין שיש מקום כזה בראשך… שבו טוב לך…”",
    story_full_text: "“דע שאמא ואבא אוהבים אותך מאוד… עכשיו בוא נצא למקום ידידותי… דמיין שיש מקום כזה בראשך… שבו טוב לך… מצא אותו והישאר שם קצת… דמיין את המקום היפה והבטוח ביותר שאתה יכול לדמיין… שבו אמא ואבא תמיד לצידך ועוזרים לך…<br><br>…כי זה העולם שבנית בעצמך, שבו כל מה שאתה מאמין בו הוא אמת. זה העולם שבו הכל באמת מתגשם… שבו מחשבות הופכות למציאות ושבו כל מה שאתה מאמין בו יכול לקרות… חשוב על כך שבמקום הזה אתה קוסם אמיתי וכל הרצונות שלך מתגשמים…<br><br>…האמן שאתה חכם, ושאתה לומד מהר מאוד ובקלות. האמן בזה, והכל יתגשם. חוש ביטחון בכוחותיך, חשוב על כך שכל ידע חדש מגיע אליך בקלות.<br><br>האמן שאוהבים אותך מאוד עמוק, חוש זאת בכל ליבך, ותן לנשמה שלך להתמלא באושר. דמיין זוהר חם בחזה, נשום את תחושת האהבה הזו בכל תא, ... אמא ואבא שמחים כל כך שיש להם אותך…”",
    tag_modes: "הפעלה מהירה של שינויים חיוביים",
    title_modes: "4 מצבים מיוחדים לעזרה ותמיכה רגשית",
    sub_modes: "בחרו תרחיש ליצירה מיידית של סיפורי הרגעה או עזרה דחופה",
    mode_morning_title: "כוון בוקר",
    mode_morning_desc: "זריקת מרץ, אמונה עצמית, קלות בלימודים ושמחה לקראת יום חדש.",
    btn_start_morning: "הפעל כוון בוקר",
    mode_bedtime_title: "סיפור לפני השינה",
    mode_bedtime_desc: "מעבר עדין לשינה, שחרור מועקות יומיות וטיפוח שלווה עמוקה.",
    btn_start_bedtime: "הפעל מצב הרגעה לפני השינה",
    mode_prayer_title: "מדיטציית תפילה",
    mode_prayer_desc: "שלווה רוחנית, הודיה, רוגע וברכה של הלך רוח מואר למשפחה.",
    btn_start_prayer: "הפעל מדיטציית תפילה",
    mode_emergency_title: "עזרה דחופה בזמן התקף זעם",
    mode_emergency_desc: "אלגוריתם 4 שלבים מיידי להורה + יצירת שמע AI מהירה לקרקוע הילד.",
    btn_start_emergency: "🚨 הפעל עזרה דחופה",
    em_header: "🚨 פרוטוקול חירום: תמיכה בזמן התקף זעם",
    em_step1_title: "איפוק ושליטה",
    em_step1_desc: "קחו נשימה עמוקה. אתם עוגן רגוע של ביטחון עבור ילדכם.",
    em_step2_title: "בטיחות תחילה",
    em_step2_desc: "הנמיכו את הקול, הרחיקו חפצים חדים, רדו לגובה העיניים של הילד.",
    em_step3_title: "תיקוף רגשי",
    em_step3_desc: "אמרו בשקט: 'אני רואה שקשה לך עכשיו ואתה כועס. אני כאן איתך.'",
    em_step4_title: "קרקוע",
    em_step4_desc: "הפעילו שמע מרגיע של AI והנחו את הילד לקצב נשימה סדיר.",
    em_input_label: "תארו את הסיטואציה (מה קרה?):",
    btn_gen_emergency: "✨ צור שמע מהיר",
    tag_studio: "סטודיו למדיטציה - פיתוח המבוסס על שיטות נוירופסיכולוגיה של הילד",
    title_studio: "סיפור מדיטציה מותאם אישית",
    sub_studio: "הקלטת קולכם + רצועת MP3 באולפן + קריינות AI דינמית",
    label_child_name: "שם הילד/ה:",
    label_child_gender: "מין הילד/ה:",
    opt_girl: "ילדה",
    opt_boy: "ילד",
    label_child_age: "גיל (בשנים):",
    label_audio_source: "מקור הקריינות:",
    opt_source_parent: "🎙 קול של אמא או אבא",
    opt_source_mp3: "🎵 רצועת MP3 אולפנית",
    opt_source_tts: "🤖 קריין AI דינמי (קול עמוק)",
    label_voice_timbre: "גון וסגנון הקול:",
    opt_male_deep: "🎙 גברי - קול עמוק ורגוע",
    opt_female_calm: "🎙 נשי - קול רגוע",
    opt_generated_parent: "🎙 קול הורה מחולל",
    label_meditation_mode: "מצב מדיטציה:",
    opt_mode_bedtime: "🌙 לפני השינה (הרדמה)",
    opt_mode_morning: "☀️ בוקר (ביטחון עצמי)",
    opt_mode_emergency: "🚨 חירום (קרקוע)",
    opt_mode_prayer: "🙏 מדיטציית תפילה (שלווה רוחנית)",
    label_mic_rec: "🎙 הקלטת קול (עד 30 שניות):",
    mic_press_text: "לחץ להקלטת קול של הורה או סבתא (עד 30 שניות)",
    btn_generate: "✨ צור סיפור מדיטציה בקול של אמא, אבא או סבתא",
    player_title_default: "סיפור מדיטציה",
    player_sub_default: "קול מרגיע ומוכר • ללא מוזיקה",
    tag_pricing: "מונטיזציה שקופה",
    title_pricing: "בחרו מסלול מנוי",
    sub_pricing: "גישת Freemium + מכסות יצירה + תוספת דקות",
    plan_title_free: "חינם (בסיסי)",
    plan_free_sub: "להרגיש את ערך השירות",
    plan_forever: "/ לתמיד",
    pf_free_1: "✅ 2 בקשות AI ביום",
    pf_free_2: "✅ סיפור מדיטציה סטנדרטי",
    pf_free_3: "✅ קריינות בקול רגוע ונעים",
    pf_free_3_extra: "✅ נוירוגימנסטיקה ותרגילים לאיזון רגשי",
    pf_free_3_emergency: "✅ עזרה דחופה בזמן התקף זעם",
    pf_free_4: "❌ ללא שמירת היסטוריה",
    btn_plan_free: "התחל בחינם",
    plan_title_basic: "בסיסי",
    plan_basic_sub: "לכוונים יומיומיים",
    billing_monthly: "חודשי",
    billing_annual: "תשלום שנתי <span class=\"discount-badge\">-67% הנחה</span>",
    plan_per_month: "/ חודש",
    pf_basic_1: "✅ 50 דקות יצירה בחודש",
    pf_basic_2: "✅ התאמה אישית לשם הילד",
    pf_basic_3: "✅ תמיכה ב-3 שפות (RU, EN, HE)",
    pf_basic_4: "✅ שמירת היסטוריית קולות וסיפורים",
    btn_plan_basic: "בחר בסיסי",
    popular_badge: "🔥 הבחירה הפופולרית",
    plan_title_premium: "פרימיום",
    plan_premium_sub: "שלווה מלאה והרמוניה משפחתית",
    pf_prem_1: "✅ 120 דקות יצירה (~12 סיפורים)",
    pf_prem_2: "✅ תמיכה בזמן התקפי זעם",
    pf_prem_3: "✅ גישה משפחתית עד 4 מכשירים",
    pf_prem_4: "✅ תמיכה בסדר עדיפויות",
    btn_plan_premium: "הפעל פרימיום",
    plan_title_platinum: "פלטינום",
    plan_plat_sub: "מקסימום משאבים ותמיכת VIP",
    pf_plat_1: "✅ 300 דקות יצירת שמע",
    pf_plat_2: "✅ ספריית מדיטציות ללא הגבלה",
    pf_plat_3: "✅ סוכן מפקח אישי AI",
    pf_plat_4: "✅ גישה משפחתית עד 8 מכשירים",
    btn_plan_platinum: "הפעל פלטינום",
    topup_tag: "⚡ דקות נוספות:",
    topup_title: "חבילת 50 דקות נוספות",
    topup_desc: "הסתיימה המכסה? רכשו 50 דקות נוספות ללא שינוי מסלול המנוי.",
    btn_topup: "רכשו ב-$4.99",
    nda_title: "📜 תנאי שירות והסכם משתמש",
    nda_sub: "הצהרת ויתור והגבלת אחריות (DISCLAIMER)",
    label_nda_name: "שם מלא של החותם:",
    label_auth_phone: "WhatsApp / Telegram (חובה):",
    label_nda_email: "כתובת דוא\"ל:",
    label_signature_canvas: "✍️ חתום בעזרת העכבר או האצבע למטה:",
    btn_clear_sig: "נקה",
    btn_submit_nda: "✅ אישור וחתימה על NDA (המשך במסמך)",
    custdev_modal_title: "💬 סקר + מתנה: עזרו לנו לשפר את המוצר",
    custdev_modal_sub: "בחרו תרחיש, ענו על 3 שאלות וקבלו מתנה:",
    btn_submit_custdev: "🚀 שלח תשובות וקבל מתנה",
    modal_auth_title: "התחברות ל-MindEcho AI",
    modal_auth_sub: "שמרו את הגדרות המדיטציה וההתקדמות שלכם",
    btn_auth_google: "התחברות עם Google",
    btn_auth_apple: "התחברות עם Apple ID",
    label_terms_agree: "אני מסכים לתנאי השימוש ומדיניות הפרטיות.",
    btn_auth_submit: "התחבר / הרשם",
    footer_brand_desc: "מערכת אקולוגית גלובלית לבריאות נפשית של המשפחה. בינה מלאכותית, נוירופסיכולוגיה ו-CBT.",
    footer_nav_title: "ניווט",
    legal_terms: "תנאי שימוש",
    copyright_text: "© 2026 MindEcho AI Inc. כל הזכויות שמורות."
  }
};

function switchLanguage(langKey, btnEl) {
  appState.lang = langKey;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));

  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const onclickAttr = btn.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes(`'${langKey}'`)) {
        btn.classList.add('active');
      }
    });
  }

  if (langKey === 'he') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', langKey);
  }

  const langDict = translations[langKey];
  if (langDict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (langDict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = langDict[key];
        } else {
          el.innerHTML = langDict[key];
        }
      }
    });
  }

  logClickAnalytics('Language_Switched', langKey, 0);
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
  const langDict = translations[appState.lang || 'ru'] || translations.ru;

  if (fullStory) {
    if (fullStory.classList.contains('hidden')) {
      fullStory.classList.remove('hidden');
      if (btn) btn.innerText = langDict.btn_toggle_story_text_collapse || "Свернуть текст 🔼";
    } else {
      fullStory.classList.add('hidden');
      if (btn) btn.innerText = langDict.btn_toggle_story_text || "Развернуть весь текст 📖";
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
  var name = (document.getElementById('nda-user-name').value || '').trim() || 'Anonymous';
  var contact = document.getElementById('nda-user-contact') ? document.getElementById('nda-user-contact').value.trim() : '';
  var email = document.getElementById('nda-user-email') ? document.getElementById('nda-user-email').value.trim() : '';
  var now = new Date();
  var dateStr = now.toLocaleString('ru-RU');

  if (!contact) {
    alert('Please provide your WhatsApp or Telegram to continue.');
    return;
  }

  try { await generateDisclaimerPDF(name, contact, email, dateStr); } catch(e) { console.warn('PDF err:', e); }

  localStorage.setItem('ndaSigned', 'true');
  alert('Agreement signed! / Soglashenie podpisano!\n' + name + '\nDocument sent to Google Drive.');
  closeNDAModal();

  logClickAnalytics('NDA_Signed', name, 0, { user_name: name, contact: contact, email: email, phone: contact });

  if (appState.pendingCheckout) {
    appState.pendingCheckout = false;
    document.getElementById('checkout-plan-name').innerText = appState.selectedPlan;
    document.getElementById('checkout-plan-price').innerText = '$' + appState.selectedPrice;
    document.getElementById('checkout-modal').classList.remove('hidden');
  }
}

async function generateDisclaimerPDF(name, contact, email, dateStr) {
  if (typeof html2pdf === 'undefined') { console.warn('html2pdf not loaded'); return; }
  var canvas = document.getElementById('signature-canvas');
  var sigImg = canvas ? canvas.toDataURL('image/png') : '';

  var sigBlock = sigImg
    ? '<div style="margin-top:12px;"><p style="font-size:12px;margin-bottom:4px;"><b>Electronic Signature / Podpis:</b></p><img src="' + sigImg + '" style="border:1px solid #ccc;border-radius:6px;max-width:360px;background:#fff;display:block;" /></div>'
    : '';

  var html = '<div style="font-family:Arial,sans-serif;padding:32px;max-width:700px;margin:0 auto;color:#111;">'
    + '<div style="text-align:center;margin-bottom:20px;">'
    + '<h1 style="font-size:20px;color:#1a1a2e;margin-bottom:4px;">MindEcho AI &mdash; DISCLAIMER</h1>'
    + '<p style="font-size:12px;color:#666;">Date / Data: ' + dateStr + '</p></div>'
    + '<h2 style="font-size:15px;border-bottom:2px solid #ddd;padding-bottom:6px;">&#x1F1F7;&#x1F1FA; Otkaz ot otvetstvennosti (RU)</h2>'
    + '<p style="font-size:12.5px;line-height:1.75;"><b>1. Informacionnyj harakter.</b> Servis MindEcho AI predostavlyaetsya isklyuchitelno v informacionnyh, obrazovatelnyh i fasilitacionnyh celyah. Servis ne yavlyaetsya medicinskoj, psihologicheskoj ili psihoterapevticheskoj pomoshyu, ne stavit diagnozov i ne zamenyaet konsultacij kvalificirovannyh specialistov.</p>'
    + '<p style="font-size:12.5px;line-height:1.75;"><b>2. Otvetstvennost polzovatelya.</b> Polzovatel prinimaet na sebya polnuyu otvetstvennost za primenenie lyubyh sovetov, praktik, meditacij i sgenerirovannyh svedenij, poluchennyh s pomoshyu MindEcho AI.</p>'
    + '<p style="font-size:12.5px;line-height:1.75;"><b>3. Ispolzovanie golosa.</b> Polzovatel garantiruet zakonnye prava na ispolzovanie zagruzhaemyh golosovyh dannyh i berot na sebya polnuyu otvetstvennost za posledstviya generacii audiokontenta.</p>'
    + '<p style="font-size:12.5px;line-height:1.75;"><b>4. Otkaz ot pretenzij.</b> Pravoobladatel Konstantyn Shlomovich i affilirovannye lica ne nesut otvetstvennosti za pryamye, kosvennye ili moralnye ubytki, voznikshie v rezultate ispolzovaniya servisa.</p>'
    + '<h2 style="font-size:15px;border-bottom:2px solid #ddd;padding-bottom:6px;margin-top:22px;">&#x1F1FA;&#x1F1F8; Disclaimer (EN)</h2>'
    + '<p style="font-size:12.5px;line-height:1.75;"><b>1. Informational Nature.</b> The MindEcho AI service is provided solely for informational, educational, and facilitation purposes. It does not constitute medical or psychotherapeutic assistance and does not replace consultations with qualified specialists.</p>'
    + '<p style="font-size:12.5px;line-height:1.75;"><b>2. User Responsibility.</b> The User assumes full responsibility for the application of any advice, practices, meditations, and generated content obtained through MindEcho AI.</p>'
    + '<p style="font-size:12.5px;line-height:1.75;"><b>3. Voice & Biometrics.</b> The User guarantees legal rights to use uploaded voice data and accepts full responsibility for generated audio content.</p>'
    + '<p style="font-size:12.5px;line-height:1.75;"><b>4. Waiver of Claims.</b> Rights holder Konstantyn Shlomovich and affiliated parties shall not be liable for any direct, indirect, or moral damages arising from use of the Service. By using MindEcho AI, the User confirms agreement and waives all legal and financial claims.</p>'
    + '<div style="margin-top:28px;border-top:2px solid #ddd;padding-top:18px;">'
    + '<h3 style="font-size:14px;margin-bottom:10px;">Signature / Podpis</h3>'
    + '<table style="font-size:12.5px;width:100%;border-collapse:collapse;">'
    + '<tr><td style="padding:4px 0;"><b>Full Name / FIO:</b></td><td style="padding:4px 8px;">' + name + '</td></tr>'
    + '<tr><td style="padding:4px 0;"><b>WhatsApp / Telegram:</b></td><td style="padding:4px 8px;">' + contact + '</td></tr>'
    + '<tr><td style="padding:4px 0;"><b>Email:</b></td><td style="padding:4px 8px;">' + (email || '&mdash;') + '</td></tr>'
    + '<tr><td style="padding:4px 0;"><b>Date / Data:</b></td><td style="padding:4px 8px;">' + dateStr + '</td></tr>'
    + '</table>'
    + sigBlock
    + '<p style="font-size:10.5px;color:#999;margin-top:14px;">&copy; 2026 MindEcho AI Inc. &mdash; Electronic signature is legally valid.</p>'
    + '</div></div>';

  var el = document.createElement('div');
  el.innerHTML = html;
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);

  var safeName = name.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 30);
  var filename = 'MindEchoAI_Disclaimer_' + safeName + '.pdf';
  var opt = {
    margin: 0.5,
    filename: filename,
    image: { type: 'jpeg', quality: 0.97 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  var pdfBlob = await html2pdf().set(opt).from(el).outputPdf('blob');
  document.body.removeChild(el);

  // Download locally
  var url = URL.createObjectURL(pdfBlob);
  var a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 3000);

  // Upload to Google Drive
  await sendDisclaimerToGoogleDrive(pdfBlob, filename, name, contact, email, dateStr);
}

async function sendDisclaimerToGoogleDrive(pdfBlob, filename, name, contact, email, dateStr) {
  try {
    var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2lkT1VuFxjNROQ5GXF_qE0lYQVi7GW_8ZSjqf4s_XsyB01mClWcRKrLWMfpFyN3gQ/exec';
    var arrayBuffer = await pdfBlob.arrayBuffer();
    var bytes = new Uint8Array(arrayBuffer);
    var binary = '';
    for (var i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); }
    var base64 = btoa(binary);
    var payload = JSON.stringify({ action: 'uploadDisclaimerPDF', filename: filename, fileBase64: base64, mimeType: 'application/pdf', userName: name, contact: contact, email: email, dateStr: dateStr });
    await fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: payload });
    console.log('PDF dispatched to Google Drive Apps Script');
  } catch(err) { console.warn('Google Drive send error:', err); }
}

/* ===== CustDev: 3-question multilingual surveys ===== */
var custdevQuestions = {
  burnout: {
    ru: [
      '1. Kak chasto vy chuvstvuete ustalost ot roditelstva i hotite pobyt v odinochestve?',
      '2. Skolko chasov lichnogo vremeni u vas ostaetsya v den posle detej?',
      '3. Chto meshaet vam effektivno vosstanavlivatsya?'
    ],
    en: [
      '1. How often do you feel exhausted from parenting and need time alone?',
      '2. How many hours of personal time do you have per day after children?',
      '3. What prevents you from recovering effectively?'
    ]
  },
  tantrums: {
    ru: [
      '1. Kak chasto u vashego rebyonka sluchayutsya isteriki (v nedelyu)?',
      '2. Kakie metody vy uzhe probovali, chtoby spravitsya s isterikami?',
      '3. Kak vy ocenivaete svoe emocionalnoe sostoyanie vo vremya isteriki rebyonka?'
    ],
    en: [
      '1. How often does your child have tantrums (per week)?',
      '2. What methods have you tried to deal with tantrums?',
      '3. How would you rate your emotional state during your child\'s tantrum?'
    ]
  },
  confidence: {
    ru: [
      '1. Zamechaete li vy u rebyonka neuverennost ili trevozhnost v novyh situaciyah?',
      '2. Kakie situacii naibolee slozhny dlya vashego rebyonka?',
      '3. Chto pomogaet vashemu rebyonku stat bolee uverennym?'
    ],
    en: [
      '1. Do you notice self-doubt or anxiety in your child in new situations?',
      '2. What situations are most challenging for your child?',
      '3. What helps your child become more confident?'
    ]
  },
  expert: {
    ru: [
      '1. Kakovy vash professionalnyj opyt v detskoj psihologii ili pedagogike?',
      '2. Kakie podhody naibolee effektivny dlya razvitiya EQ u detej?',
      '3. Kak vy ocenivaete potencial primeneniya II v emocionalnom razvitii detej?'
    ],
    en: [
      '1. What is your professional experience in child psychology or pedagogy?',
      '2. Which approaches do you find most effective for developing EQ in children?',
      '3. How do you assess the potential of AI in children\'s emotional development?'
    ]
  }
};

var custdevLang = 'ru';

function renderCustDevQuestions(scenarioKey) {
  var lang = custdevLang || 'ru';
  var qs = (custdevQuestions[scenarioKey] && custdevQuestions[scenarioKey][lang])
    ? custdevQuestions[scenarioKey][lang]
    : custdevQuestions['burnout']['ru'];
  var container = document.getElementById('custdev-q-container');
  if (!container) return;
  container.innerHTML = qs.map(function(q, i) {
    return '<div class="custdev-q-item" style="margin-bottom:14px;">'
      + '<label style="display:block;font-weight:600;margin-bottom:6px;font-size:0.88rem;line-height:1.4;">' + q + '</label>'
      + '<textarea id="cd-q-' + i + '" rows="2" placeholder="..." class="form-input" style="width:100%;border:1px solid rgba(255,255,255,0.2);resize:none;min-height:54px;"></textarea>'
      + '</div>';
  }).join('');
}

function switchCustDevLang(lang) {
  custdevLang = lang;
  document.querySelectorAll('.cd-lang-btn').forEach(function(b) {
    b.style.background = 'rgba(255,255,255,0.06)';
    b.style.borderColor = 'rgba(255,255,255,0.25)';
    b.style.fontWeight = '600';
  });
  var activeBtn = document.querySelector('.cd-lang-btn[data-lang="' + lang + '"]');
  if (activeBtn) {
    activeBtn.style.background = 'linear-gradient(135deg, #ff6b35, #e8520a)';
    activeBtn.style.borderColor = '#ff6b35';
  }
  renderCustDevQuestions(appState.currentCustDevScenario || 'burnout');
}

function openCustDevModal() {
  custdevLang = 'ru';
  document.querySelectorAll('.cd-lang-btn').forEach(function(b) { b.style.background = 'rgba(255,255,255,0.06)'; b.style.borderColor = 'rgba(255,255,255,0.25)'; });
  var ruBtn = document.querySelector('.cd-lang-btn[data-lang="ru"]');
  if (ruBtn) { ruBtn.style.background = 'linear-gradient(135deg, #ff6b35, #e8520a)'; ruBtn.style.borderColor = '#ff6b35'; }
  document.getElementById('custdev-modal').classList.remove('hidden');
  renderCustDevQuestions(appState.currentCustDevScenario || 'burnout');
  logClickAnalytics('CustDevModal_Opened', 'CustDev', 0);
}

function closeCustDevModal() {
  document.getElementById('custdev-modal').classList.add('hidden');
}

function selectCustDevScenario(scenarioKey) {
  appState.currentCustDevScenario = scenarioKey;
  document.querySelectorAll('.custdev-btn').forEach(function(btn) { btn.classList.remove('active'); });
  var activeBtn = document.getElementById('cd-btn-' + scenarioKey);
  if (activeBtn) activeBtn.classList.add('active');
  renderCustDevQuestions(scenarioKey);
}

function handleCustDevSubmit(e) {
  e.preventDefault();
  var scenario = appState.currentCustDevScenario || 'burnout';
  var lang = custdevLang || 'ru';
  var contact = document.getElementById('cd-input-contact') ? document.getElementById('cd-input-contact').value.trim() : '';
  logClickAnalytics('CustDev_Submitted', scenario, 0, { phone: contact, user_name: contact, plan_name: 'custdev_' + scenario + '_' + lang });
  var thankMsg = lang === 'en'
    ? 'Thank you for your answers! You have been granted priority VIP access.'
    : 'Spasibo za vashi otvety! Vam predostavlen prioritetnyj VIP-dostup.';
  alert(thankMsg);
  closeCustDevModal();
}
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
window.switchCustDevLang = switchCustDevLang;
window.renderCustDevQuestions = renderCustDevQuestions;
