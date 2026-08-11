# 📜 ФАЙЛ 1: ИССЛЕДОВАНИЕ ТЕМПА И ИСТОЧНИК РОДИТЕЛЬСКОГО ГОЛОСА ИЗ АУДИОЗАПИСИ

## 🎙 ИСТОЧНИК РОДИТЕЛЬСКОГО ГОЛОСА (SPEECH-TO-SPEECH И КЛОНИРОВАНИЕ):
* **Голос родителя**: Берется напрямую **из аудиозаписи, записанной в приложении с микрофона или загруженной пользователем** (`parent_recorded_voice.webm` / `appState.recordedAudioBlob`).
* **Способ передачи в ElevenLabs**: Аудиофайл отправляется на эндпоинт **Instant Voice Cloning (`POST /v1/voices/add`)** и **Speech-to-Speech (`POST /v1/speech-to-speech/{voice_id}`)**.
* **Исключение хардкодных штампов**: Любые упоминания посторонних готовых ID пресетов убраны из отчетов. Голос формируется динамически на основе голоса родителя из приложения.

---

## 🔍 АНАЛИЗ И РЕШЕНИЕ ДЛЯ РАВНОМЕРНОГО МЕДЛЕННОГО ТЕМПА:
1. **Ограничение ElevenLabs API**:
   * Минимальный порог параметра `speed` в ElevenLabs равен **`0.70`**.
2. **Равномерность артикуляции с 1-го слова**:
   * В первые предложения вставлены тире (`—`), запятые (`,`) и многоточия (`...`) перед паузами `<break time="3.5s"/>`.
   * Это принудительно заставляет модель снижать тон и проговаривать каждое слово первой фразы **ОДИНАКОВО МЕДЛЕННО И ГИПНОТИЧЕСКИ С 1-ГО СЛОВА**.

---

## [SYSTEM CONFIGURATION & VOICE PARAMS]

* **TARGET_PACE**: `70% of standard parent speech rate (strictly 70% ultra-slow bedtime pacing)`
* **ELEVENLABS_SPEED**: `0.70` (strictly 0.70 minimum allowed speed)
* **ELEVENLABS_STABILITY**: `0.50` (prevents early clause rushing)
* **ELEVENLABS_SIMILARITY_BOOST**: `0.80`
* **ELEVENLABS_MODEL**: `eleven_multilingual_v2`
* **VOICE_SOURCE**: `Родительский голос из аудиозаписи в приложении (Speech-to-Speech / Клонированный голос с микрофона/файла пользователя)`
* **DEFAULT_DEMO_TRACK**: `audio/meditation1.mp3` (for all standard demo play buttons)
* **GENERATED_TRACK_BTN**: `«▶️ Слушать сказку-медитацию, сгенерированную заданным голосом»`
