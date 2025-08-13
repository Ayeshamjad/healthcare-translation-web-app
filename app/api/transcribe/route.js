import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Expected form-data" }), { status: 400 });
    }
    const form = await req.formData();
    const file = form.get("audio");
    if (!file) return new Response(JSON.stringify({ error: "Missing file 'audio'" }), { status: 400 });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Convert to a Blob/File compatible with OpenAI SDK
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const transcript = await client.audio.transcriptions.create({
      file: new File([buffer], "audio.webm", { type: file.type || "audio/webm" }),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"]
    });

    return Response.json({ text: transcript.text ?? "" });
  } catch (err) {
    console.error("transcribe error", err);
    return new Response(JSON.stringify({ error: "Transcription failed" }), { status: 500 });
  }
}
