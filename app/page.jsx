'use client';
import './globals.css';
import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "../lib/debounce";
import { LANGS, labelToCode } from "../lib/languages";

export default function Home() {
  const [inputLang, setInputLang] = useState("English");
  const [outputLang, setOutputLang] = useState("Spanish");

  const [finalText, setFinalText] = useState("");     
  const [interimText, setInterimText] = useState(""); 
  const [translated, setTranslated] = useState("");   
  const [recording, setRecording] = useState(false);

  const recRef = useRef(null);
  const lastSentWordsRef = useRef(0); // track last translated word count

  // Incremental translation
  const translateChunk = async (textChunk) => {
    const trimmed = textChunk.trim();
    if (!trimmed) return;

    const words = trimmed.split(/\s+/);
    if (words.length <= lastSentWordsRef.current) return;

    const newWords = words.slice(lastSentWordsRef.current).join(' ');
    console.log("Translating new words:", newWords);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newWords,
          sourceLang: inputLang,
          targetLang: outputLang,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Translate API error:", errText);
        return;
      }
      const data = await res.json();
      console.log("Translated chunk:", data);
      if (data?.translated) {
        setTranslated(prev => prev ? prev + " " + data.translated : data.translated);
        lastSentWordsRef.current = words.length;
      }
    } catch (e) {
      console.error("Translation fetch failed:", e);
    }
  };

  // Debounced incremental translation
  const translateLive = useCallback(debounce(translateChunk, 300), [inputLang, outputLang]);

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech Recognition not supported. Use Chrome/Edge.");

    const rec = new SR();
    rec.lang = labelToCode(inputLang);
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      let interim = "";
      let updatedFinal = finalText;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          updatedFinal += " " + result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      updatedFinal = updatedFinal.trim();
      setFinalText(updatedFinal);
      setInterimText(interim);

      // Translate new words incrementally
      const combined = (updatedFinal + " " + interim).trim();
      translateLive(combined);
    };

    rec.onerror = (e) => console.error("ASR error:", e);
    rec.onend = () => {
      if (recording) {
        console.log("Auto-restarting recognition");
        rec.start();
      }
    };

    rec.start();
    recRef.current = rec;
    setRecording(true);
    console.log("Recording started");
  };

  const stopRecording = () => {
    setRecording(false);
    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
    setInterimText("");
    console.log("Recording stopped");

    // Translate remaining words immediately
    translateChunk(finalText.trim());
  };

  const speakTranslation = () => {
    if (!translated) return;

    const utter = new SpeechSynthesisUtterance(translated);

    // Select voice matching target language
    const voices = speechSynthesis.getVoices();
    const targetLangCode = labelToCode(outputLang).split('-')[0]; // e.g., "es" from "es-ES"
    const voice = voices.find(v => v.lang.startsWith(targetLangCode));

    if (voice) utter.voice = voice;
    utter.lang = labelToCode(outputLang);

    console.log("Speaking translation with voice:", voice?.name || "default");
    speechSynthesis.speak(utter);
  };

  // Reload voices when they become available
  useEffect(() => {
    speechSynthesis.onvoiceschanged = () => {
      console.log("Voices loaded:", speechSynthesis.getVoices());
    };
  }, []);

  const clearAll = () => {
    setFinalText("");
    setInterimText("");
    setTranslated("");
    lastSentWordsRef.current = 0;
  };

  const originalDisplay = (finalText + (interimText ? " " + interimText : "")).trim();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-1">
          Healthcare Translation App
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Live transcription + incremental translation demo
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700">Input Language</label>
            <select value={inputLang} onChange={e => setInputLang(e.target.value)} className="mt-1 w-full p-2 border rounded-md">
              {LANGS.map(l => <option key={l.label}>{l.label}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700">Output Language</label>
            <select value={outputLang} onChange={e => setOutputLang(e.target.value)} className="mt-1 w-full p-2 border rounded-md">
              {LANGS.map(l => <option key={l.label}>{l.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Original Transcript</h2>
              <span className={`text-xs ${recording ? "text-green-600" : "text-gray-400"}`}>
                {recording ? "● Recording" : "Idle"}
              </span>
            </div>
            <div className="h-48 overflow-auto rounded-md bg-white p-3 text-gray-800 border">
              {originalDisplay || <span className="text-gray-400">Speak or type...</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {!recording ? (
                <button onClick={startRecording} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">🎙 Start</button>
              ) : (
                <button onClick={stopRecording} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">⏹ Stop</button>
              )}
              <button onClick={clearAll} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">🧹 Clear</button>
            </div>
          </div>

          <div className="border rounded-xl p-4 bg-green-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Translated Transcript</h2>
            <div className="h-48 overflow-auto rounded-md bg-white p-3 text-gray-800 border">
              {translated || <span className="text-gray-400">Translation will appear here…</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={speakTranslation} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">🔊 Speak</button>
              <button onClick={() => navigator.clipboard.writeText(translated || "")} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">📋 Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
