export async function POST(req) {
  try {
    const { text, sourceLang, targetLang } = await req.json();
    console.log("Translate API called with:", { text, sourceLang, targetLang });

    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { status: 500 });
    }

    if (!text || !targetLang) {
      console.error("Missing text or targetLang");
      return new Response(JSON.stringify({ error: "Missing text/targetLang" }), { status: 400 });
    }

    const prompt = `You are a medical translator.
Translate from ${sourceLang || "auto-detect"} to ${targetLang}.
- Preserve clinical terms.
- Keep dosages/units intact.
- Return only translated text.

Text:
${text}`.trim();

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    if (!r.ok) {
      const errText = await r.text();
      console.error("Gemini API error:", errText);
      return new Response(JSON.stringify({ error: "Gemini failed", detail: errText }), { status: 500 });
    }

    const data = await r.json();
    const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    console.log("Gemini translated text:", translated);

    return new Response(JSON.stringify({ translated }));
  } catch (e) {
    console.error("Translate route error:", e);
    return new Response(JSON.stringify({ error: "Translation failed" }), { status: 500 });
  }
}
