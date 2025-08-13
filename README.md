# Healthcare Translation Web App (Prototype)

A mobile-first prototype for real-time multilingual translation in clinical encounters. It performs:
- Speech-to-text (browser mic) for the **original transcript**
- Translation via **OpenAI GPT-4o-mini** with a clinical prompt
- Text-to-speech playback of the **translated** text

> **Note:** This demo is for evaluation only. Do not input Protected Health Information (PHI). No transcripts are stored on the server.

## Features
- Dual transcript panes (original + translated) updated in real time
- Language selection for input/output
- "Speak Translation" with browser speech synthesis
- Fallback endpoint for file-based transcription (OpenAI Whisper) if you enable it

## Stack
- Next.js 14 (App Router)
- TailwindCSS
- OpenAI API (chat for translation; optional Whisper for file transcription)
- Web Speech API (real-time mic STT) & Web Speech Synthesis API (TTS)

## Quick Start

1. **Download & Install**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.sample` to `.env.local` and set:
     ```
     OPENAI_API_KEY=sk-your-key
     ```

3. **Run locally**
   ```bash
   npm run dev
   # open http://localhost:3000
   ```

4. **Try it**
   - Use Chrome or Edge.
   - Pick input/output languages.
   - Click **Start** and speak a short sentence; watch original + translated panes update.
   - Click **Speak Translation**.

## Deploy to Vercel

1. Push to a GitHub repo.
2. Import the repo in **Vercel**.
3. Add `OPENAI_API_KEY` in Project → Settings → Environment Variables.
4. Deploy. Done.

## Security & Privacy (Demo)
- No server-side persistence. All text is transient.
- Do not process PHI.
- For production: add auth, HTTPS-only cookies, audit logs, encryption at rest, and a data retention policy.

## Testing Checklist
- ✅ Microphone permission flow (allow/deny)
- ✅ Real-time interim vs final transcript updates
- ✅ Translation accuracy for medical terms (tachycardia, HbA1c, metformin)
- ✅ TTS playback per language
- ✅ Error handling (API key missing, rate limited, mic blocked)
- ✅ Mobile viewport and tap targets

## Optional Whisper Transcription (File Upload)
- Configure `OPENAI_API_KEY` (requires billing).
- POST an audio file to `/api/transcribe` (form-data, key=`audio`).

## Model Card (Short)
- **Task:** Medical-style translation
- **Models:** gpt-4o-mini (translation), optional Whisper (ASR)
- **Risks:** Hallucinations, incorrect medical terminology, rare language voice availability
- **Mitigations:** Deterministic prompt, temperature=0.2, user confirmation of outputs
- **Intended Use:** Prototype demo for screening; not for clinical use

## License
MIT (for the purpose of your submission).
