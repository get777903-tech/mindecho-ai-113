# 📜 ФАЙЛ 1: ТЕКУЩИЙ АКТИВНЫЙ ПРОМПТ И НАСТРОЙКИ ELEVENLABS

## [SYSTEM CONFIGURATION & VOICE PARAMS]

* **MEDITATION_DURATION**: `4 to 30 minutes (dynamic sentence count scaling)`
* **ELEVENLABS_STABILITY**: `0.60` (strictly set to 0.60 for optimal smooth pacing)
* **ELEVENLABS_SPEED**: `0.70` (strictly 0.70 minimum allowed speed)
* **ELEVENLABS_SIMILARITY_BOOST**: `0.80`
* **ELEVENLABS_STYLE**: `0.00`
* **ELEVENLABS_MODEL**: `eleven_multilingual_v2`
* **PITCH_SHIFT**: `Pitch Shift (-3 Semitones) for deep soothing parent voice tone`
* **TEXT_FORMATTING_RULE**: `Разделение фраз на отдельные строки (\n\n) + Добавление знака тире (—), запятых (,) и многоточий (...) для понижения интонации и задержки`
* **VOICE_SOURCE**: `Родительский голос из аудиозаписи в приложении (Speech-to-Speech / Клонированный голос с микрофона/файла пользователя)`
* **DEFAULT_DEMO_TRACK**: `audio/meditation1.mp3` (for all standard demo play buttons)
* **GENERATED_TRACK_BTN**: `«▶️ Слушать сказку-медитацию, сгенерированную заданным голосом»`

---

## ⚠️ ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА ГЕНЕРАЦИИ (RULES & MANDATES)

1. **DURATION_RULE**:
   > Support dynamic meditation length from 4 to 30 minutes (±2–3 mins margin allowed) by adjusting sentence count while maintaining ultra-slow bedtime pacing.

2. **STABILITY_RULE**:
   > Use `ELEVENLABS_STABILITY = 0.60` to guarantee consistent cadence and eliminate early phrase rushing.

3. **INTONATION_LOWERING_RULE**:
   > Insert em-dashes (`—`), commas (`,`), and ellipses (`...`) before pause breaks to lower vocal pitch and elongate vowel articulation.

4. **LINE_SEPARATION_RULE**:
   > Format every sentence on its own separate line with double newlines (`\n\n`) to ensure individual phrase breath processing.

5. **VOICE_SOURCE_RULE**:
   > Parent voice MUST BE TAKEN DIRECTLY from the audio recording recorded or uploaded by the parent in the application (`parent_recorded_voice.webm` / `appState.recordedAudioBlob`) and sent via Speech-to-Speech / Instant Voice Cloning (`POST /v1/voices/add`).

6. **MOM_DAD_MANDATORY_RULE**:
   > Phrases about Mom and Dad (*"Знай, что мама и папа тебя очень сильно любят..."*) ARE MANDATORY AND MUST NEVER BE DELETED.
