# Healthcare Translation Web App (Prototype)

## Overview
This is a **real-time multilingual healthcare translation** built as part of a interview assignment.  
The allows **healthcare providers and patients** to communicate seamlessly across languages using:
- **Real-time speech-to-text transcription**
- **Incremental translation** for near real-time updates
- **Text-to-speech playback** for translated content

The solution is optimized for **medical terms, dosages, and clinical accuracy**.

---

## 🛠 Tech Stack
| Component        | Technology |
|------------------|------------|
| Frontend         | Next.js, React, TailwindCSS |
| Speech-to-Text   | Web Speech API |
| Translation      | Google Gemini 1.5 Flash |
| Text-to-Speech   | Web Speech Synthesis API |
| Deployment       | Vercel |

---

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env.local` file in the root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> Get your API key from [Google AI Studio](https://aistudio.google.com/).

### 4️⃣ Run Locally
```bash
npm run dev
```

---
## 📖 Usage
1. **Select Input & Output Languages**.
2. **Click Start** to begin live transcription.
3. Speak into your microphone – see the **original text** on the left and **translated text** on the right.
4. **Click "Speak"** to play the translated text aloud.
5. Use **Clear** to reset.

---

## 👩‍💻 Author
**Ayesha Amjad**  
[GitHub Portfolio](https://github.com/Ayeshamjad) | [LinkedIn](https://linkedin.com/in/your-link)


