import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

export async function ask(prompt, { search = false } = {}) {
  const res = await ai.models.generateContent({
    model,
    contents: prompt,
    config: search ? { tools: [{ googleSearch: {} }] } : {},
  });
  return res.text;
}

export async function askJSON(prompt, { schema, search = false } = {}) {
  const config = search
    ? { tools: [{ googleSearch: {} }] }
    : { responseMimeType: "application/json", responseJsonSchema: schema };
  const res = await ai.models.generateContent({
    model,
    contents: search ? `${prompt}\n\nReply with only JSON, no other text.` : prompt,
    config,
  });
  const text = res.text.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  return JSON.parse(text);
}
