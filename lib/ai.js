import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { retryOptions: { attempts: 1 } } });
const models = [process.env.GEMINI_MODEL || "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3-flash-preview"];
const searchTool = { tools: [{ googleSearch: {} }] };
const noSearchNote = "\n\nYou can't browse the web right now. Use what you know, and say plainly what you couldn't verify.";

async function generate(contents, config, tryModels = models) {
  let lastError;
  for (const model of tryModels) {
    try {
      return await ai.models.generateContent({ model, contents, config: { ...config, abortSignal: AbortSignal.timeout(20000) } });
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

function parseJSON(text) {
  return JSON.parse(text.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, ""));
}

export async function ask(prompt, { search = false } = {}) {
  if (search) {
    try {
      return (await generate(prompt, searchTool, models.slice(0, 1))).text;
    } catch {}
  }
  return (await generate(search ? prompt + noSearchNote : prompt, {})).text;
}

export async function askJSON(prompt, { schema, search = false } = {}) {
  if (search) {
    try {
      const res = await generate(`${prompt}\n\nReply with only JSON, no other text.`, searchTool, models.slice(0, 1));
      return parseJSON(res.text);
    } catch {}
  }
  const res = await generate(search ? prompt + noSearchNote : prompt, {
    responseMimeType: "application/json",
    responseJsonSchema: schema,
  });
  return parseJSON(res.text);
}
