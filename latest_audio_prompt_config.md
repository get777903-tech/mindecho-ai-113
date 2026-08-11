# 📜 ФАЙЛ 1: ПРОМПТ И КОНФИГУРАЦИЯ СИНТЕЗА ПОСЛЕДНЕГО АУДИО

## [SYSTEM CONFIGURATION & VOICE PARAMS]

* **TARGET_PACE**: `70% of standard parent speech rate (strictly 70% ultra-slow bedtime pacing)`
* **PITCH_SHIFT**: `-3 semitones (deep low velvet hypnotic tone)`
* **ELEVENLABS_STABILITY**: `0.85`
* **ELEVENLABS_SIMILARITY_BOOST**: `0.85`
* **ELEVENLABS_SPEED**: `0.70` (strictly slow bedtime pace)
* **ELEVENLABS_STYLE**: `0.00`
* **ELEVENLABS_MODEL**: `eleven_multilingual_v2`
* **ACTIVE_VOICE_ID**: `C0qT9fWAA22Nx02a6QJY` (Parent Recorded Voice / Instant Cloned Voice)

---

## ⚠️ ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА ГЕНЕРАЦИИ (PROMPT RULES & MANDATES)

1. **ELLIPSES_REMOVAL_RULE**:
   > All ellipses (`...`) MUST BE REMOVED from the text prior to synthesis. Replace with clean sentences and explicit 3.0-second SSML breaks (`<break time="3.0s"/>`) after every completed phrase.

2. **NO_INITIAL_PAUSE_RULE**:
   > Voice synthesis MUST start IMMEDIATELY with the spoken phrase. Do NOT put leading break tags or initial pauses before the first word to prevent background humming or initial delay.

3. **NAME_RULE**:
   > Use child name `{ИМЯ}` EXACTLY ONCE at the very beginning of the meditation script. DO NOT repeat the name in the body of the script because the parent's cloned voice is natively recognizable.

4. **MOM_DAD_MANDATORY_RULE**:
   > Phrases about Mom and Dad (*"Знай, что мама и папа тебя очень сильно любят и всегда рядом с тобой."*) ARE MANDATORY AND MUST NEVER BE DELETED.
