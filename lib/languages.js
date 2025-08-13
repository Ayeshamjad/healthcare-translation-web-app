// lib/langCodes.js
export const LANGS = [
  { label: "English", code: "en-US" },
  { label: "Spanish", code: "es-ES" },
  { label: "French", code: "fr-FR" },
  { label: "German", code: "de-DE" },
  { label: "Arabic", code: "ar-SA" },
  { label: "Chinese (Simplified)", code: "zh-CN" },
  { label: "Japanese", code: "ja-JP" },
];

export const labelToCode = (label) => LANGS.find(l => l.label === label)?.code || "en-US";
