'use client'
import { useEffect, useRef, useState } from "react";

export default function Recorder({ onTranscript, language='en-US' }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = language;
    recog.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      onTranscript({ interim, final });
    };
    recog.onend = () => setListening(false);
    recognitionRef.current = recog;
  }, [language, onTranscript]);

  const start = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.lang = language;
    recognitionRef.current.start();
    setListening(true);
  };
  const stop = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  };

  if (!supported) {
    return (
      <div className="text-sm text-red-600">
        Real-time mic transcription is not supported in this browser. Use Chrome/Edge desktop or upload audio via the optional /api/transcribe endpoint.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {!listening ? (
        <button onClick={start} className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:opacity-90">Start</button>
      ) : (
        <button onClick={stop} className="px-4 py-2 rounded-xl bg-gray-800 text-white hover:opacity-90">Stop</button>
      )}
      <span className={`text-xs ${listening ? 'text-emerald-700' : 'text-gray-500'}`}>
        {listening ? "Listening..." : "Idle"}
      </span>
    </div>
  );
}
