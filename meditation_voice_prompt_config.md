# 📜 СПЕЦИФИКАЦИЯ ПРОМПТА И НАСТРОЕК ГОЛОСА (MindEcho AI 2026)

## [SYSTEM CONFIGURATION & VOICE PARAMS]

* **TARGET_PACE**: `70% of standard parent speech rate (strictly 70% ultra-slow bedtime pacing)`
* **PITCH_SHIFT**: `-3 semitones (deep low velvet hypnotic tone)`
* **ELEVENLABS_STABILITY**: `0.50`
* **ELEVENLABS_SIMILARITY_BOOST**: `0.80`
* **ELEVENLABS_SPEED**: `0.70` (strictly slow bedtime pace)
* **ELEVENLABS_STYLE**: `0.00`
* **ELEVENLABS_MODEL**: `eleven_multilingual_v2`
* **VOICE_SOURCE**: `Родительский голос из аудиозаписи в приложении (Speech-to-Speech / Клонированный голос с микрофона/файла пользователя)`

---

## ⚠️ ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА ГЕНЕРАЦИИ (RULES & MANDATES)

1. **VOICE_SOURCE_RULE**:
   > Parent voice MUST BE TAKEN DIRECTLY from the audio recording recorded or uploaded by the parent in the application (`parent_recorded_voice.webm` / `appState.recordedAudioBlob`) and sent via Speech-to-Speech / Instant Voice Cloning (`POST /v1/voices/add`).

2. **NAME_RULE**:
   > Use child name `{ИМЯ}` EXACTLY ONCE at the very beginning of the meditation script. DO NOT repeat the name in the body of the script because the parent's cloned voice is natively recognizable.

3. **MOM_DAD_MANDATORY_RULE**:
   > Phrases about Mom and Dad (*"Знай, что мама и папа тебя очень сильно любят..."*) ARE MANDATORY AND MUST NEVER BE DELETED.

4. **SLOW_PUNCTUATION_RULE**:
   > Insert em-dashes (`—`), commas (`,`), and SSML breaks (`<break time="3.5s"/>`) between short initial clauses to guarantee equal slow hypnotic speech rate from the very first word.
