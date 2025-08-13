'use client'
import { LANGUAGES } from "@/lib/languages";

export default function LanguageSelect({ label, value, onChange }) {
  return (
    <label className="flex flex-col text-sm gap-1">
      <span className="font-medium">{label}</span>
      <select
        className="border rounded-xl p-2 outline-none focus:ring w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}
