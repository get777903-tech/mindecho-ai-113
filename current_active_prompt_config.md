# 📜 ФАЙЛ 1: ТЕКУЩИЙ АКТИВНЫЙ ПРОМПТ И НАСТРОЙКИ ELEVENLABS (MINDECHO-AI-113)

## [SYSTEM CONFIGURATION & VOICE PARAMS]

* **RESTORED_BUTTONS_RULE**: `Восстановлена полная функциональность всех кнопок главной страницы (как в mindecho-ai-116), включая кнопку "Развернуть весь текст 📖"`
* **BUTTON_LOADING_TEXT**: `Подождите, создаётся сказка-медиация с голосом родителя или бабушки`
* **BUTTON_READY_TEXT**: `Слушать сказку-медиацию сгенерированую Заданным голосом`
* **SEPARATE_PLAYBACK_CONTROLS**:
  - **Круглая кнопка ▶️ (`#play-btn`)**: Управляет ИСКЛЮЧИТЕЛЬНО файлом `meditation1.mp3` (включает/ставит на паузу).
  - **Кнопка "Слушать сказку-медиацию сгенерированую Заданным голосом" (`#meditation-status-badge` / `#btn-create-meditation`)**: Управляет ИСКЛЮЧИТЕЛЬНО сгенерированным аудиотреком родительского голоса ElevenLabs.
* **NAME_SINGLE_MENTION_RULE**: `Имя ребенка упоминается СТРОГО 1 РАЗ в самом начале медитации`
* **WORD_PAUSE_RULE**: `Паузы 1.5 секунды <break time="1.5s"/> между всеми словами/внутренними фразами предложений`
* **CLAUSE_PAUSE_RULE**: `Паузы 3.5 секунды <break time="3.5s"/> после каждого предложения перед переносом строки \n\n`
* **OPTION_30M_TEXT**: `⏱ 30 минут (Максимально полезная медитация)`
* **MULTILINGUAL_SUPPORT**: `Полноценный перевод всех новых надписей и опций на Английский (EN) и Иврит (HE)`
* **MEDITATION_DURATION**: `от 4 до 30 минут (динамическое масштабирование предложений под запрашиваемое время)`
* **ELEVENLABS_STABILITY**: `0.60` (strictly set to 0.60 for optimal smooth pacing)
* **ELEVENLABS_SPEED**: `0.70` (strictly 0.70 minimum allowed speed)
* **ELEVENLABS_SIMILARITY_BOOST**: `0.80`
* **ELEVENLABS_STYLE**: `0.00`
* **ELEVENLABS_MODEL**: `eleven_multilingual_v2`
* **PITCH_SHIFT**: `Pitch Shift (-3 Semitones) for deep soothing parent voice tone`
* **VOICE_SOURCE**: `Родительский голос из аудиозаписи в приложении (Speech-to-Speech / Клонированный голос с микрофона/файла пользователя)`
