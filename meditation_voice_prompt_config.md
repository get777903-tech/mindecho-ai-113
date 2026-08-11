# 📜 СПЕЦИФИКАЦИЯ ПРОМПТА И НАСТРОЕК ГОЛОСА (MindEcho AI 2026)

## [SYSTEM CONFIGURATION & VOICE PARAMS]

* **TARGET_PACE**: `70% of standard parent speech rate (strictly 70% ultra-slow bedtime pacing)`
* **PITCH_SHIFT**: `-3 semitones (deep low velvet hypnotic tone)`
* **ELEVENLABS_STABILITY**: `0.70 - 0.85`
* **ELEVENLABS_SIMILARITY_BOOST**: `0.70 - 0.85`
* **ELEVENLABS_SPEED**: `0.70` (strictly slow bedtime pace)
* **ELEVENLABS_STYLE**: `0.00`
* **ELEVENLABS_MODEL**: `eleven_multilingual_v2` (or `eleven_flash_v2_5`)
* **VOICE_ID**: `C0qT9fWAA22Nx02a6QJY` (Parent Recorded Voice / Parent Voice Cloned)

---

## ⚠️ ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА ГЕНЕРАЦИИ (RULES & MANDATES)

1. **NAME_RULE**:
   > Use child name `{ИМЯ}` EXACTLY ONCE at the very beginning of the meditation script. DO NOT repeat the name in the body of the script because the parent's cloned voice is natively recognizable.

2. **MOM_DAD_MANDATORY_RULE**:
   > Phrases about Mom and Dad (*"Знай, что мама и папа тебя очень сильно любят..."*) ARE MANDATORY AND MUST NEVER BE DELETED, even when shortening the meditation to 1-min, 3-min, or 5-min versions.

3. **NO_INITIAL_PAUSE_RULE**:
   > Voice synthesis MUST start IMMEDIATELY with the text content. Do NOT include `<break time="3.0s"/>` at the very beginning of the text to avoid initial silence, humming, or background delay.

4. **PAUSE_BETWEEN_SENTENCES**:
   > Insert `<break time="3.0s"/>` or `<break time="3.5s"/>` after each short phrase to maintain deep hypnotic relaxation pacing.
