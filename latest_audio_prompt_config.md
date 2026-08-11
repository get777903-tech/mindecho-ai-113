# 📜 ФАЙЛ 1: ПРОМПТ, ПРИЧИНА УСКОРЕНИЯ И КОНФИГУРАЦИЯ СИНТЕЗА

## 🔍 АНАЛИЗ И ПРИЧИНА УСКОРЕНИЯ В НАЧАЛЕ В ELEVENLABS:
> **Причина**: При значении `stability = 0.85` движок ElevenLabs Multilingual v2 сжимает короткие первые предложения на одной строке в один быстрый речевой выдох. Но достигая длинной фразы *"Знай, что мама и папа тебя очень сильно любят..."*, алгоритм переключался на медленный расслабленный ритм.
> 
> **Решение**: 
> 1. Установлена стабильность **`stability: 0.50`** (оптимальный темп без спешки).
> 2. Каждое предложение вынесено на **отдельную строку (`\n\n`)**. Теперь движок ElevenLabs воспринимает каждое предложение как независимый глубокий выдох и говорит **ОДИНАКОВО МЕДЛЕННО И ПЛАВНО С ПЕРВОГО СЛОВА**.

---

## [SYSTEM CONFIGURATION & VOICE PARAMS]

* **TARGET_PACE**: `70% of standard parent speech rate (strictly 70% ultra-slow bedtime pacing)`
* **PITCH_SHIFT**: `-3 semitones (deep low velvet hypnotic tone)`
* **ELEVENLABS_STABILITY**: `0.50` (guarantees equal slow tempo from 1st second)
* **ELEVENLABS_SIMILARITY_BOOST**: `0.80`
* **ELEVENLABS_SPEED**: `0.70` (strictly slow bedtime pace)
* **ELEVENLABS_STYLE**: `0.00`
* **ELEVENLABS_MODEL**: `eleven_multilingual_v2`
* **CLONING_SOURCE**: `Recorded parent voice file / Microphone Audio Blob`
