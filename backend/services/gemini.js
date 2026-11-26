import { GoogleGenerativeAI } from "@google/generative-ai";

/* ------------------------------------------------------------------
   Embeddings: Gemini
   Chat / jawab: OpenRouter
   File ka naam gemini.js hi rakha hai taaki baaki imports na badalne padein.
------------------------------------------------------------------- */

// ---------- Embeddings (Gemini) ----------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

export async function embed(text) {
  const res = await embedModel.embedContent(text);
  return res.embedding.values;
}

// ---------- Chat (OpenRouter) ----------
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
console.log("OpenRouter key mili?", Boolean(process.env.OPENROUTER_API_KEY));

// .env: OPENROUTER_MODELS=model1:free,model2 (order mein try honge)
const MODELS = (process.env.OPENROUTER_MODELS || "openrouter/free")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function toPromptText(request) {
  if (typeof request === "string") return request;
  return request.contents.map((c) => c.parts.map((p) => p.text).join("\n")).join("\n");
}

function wantsJson(request) {
  return typeof request !== "string" && request.generationConfig?.responseMimeType === "application/json";
}

function extractJson(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  return start === -1 || end === -1 ? clean : clean.slice(start, end + 1);
}

export async function generate(request) {
  const prompt = toPromptText(request);
  const json = wantsJson(request);
  const maxTokens =
    (typeof request !== "string" && request.generationConfig?.maxOutputTokens) || 8000;

  // Total time budget (Render ~100 sec pe request kaat deta hai) aur ek call ka max time
  const budgetMs = (typeof request !== "string" && request.budgetMs) || 60000;
  const callTimeoutMs = (typeof request !== "string" && request.callTimeoutMs) || 45000;
  const deadline = Date.now() + budgetMs;
  let lastError;

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const remaining = deadline - Date.now();
      if (remaining < 5000) throw lastError || new Error("Time budget khatam ho gaya");

      try {
        const res = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "X-Title": "CampusAI",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: maxTokens,
            ...(json ? { response_format: { type: "json_object" } } : {}),
          }),
          signal: AbortSignal.timeout(Math.min(remaining, callTimeoutMs)),
        });

        const data = await res.json();
        if (!res.ok) {
          const err = new Error(data.error?.message || `HTTP ${res.status}`);
          err.status = res.status;
          throw err;
        }

        const choice = data.choices?.[0];
        let text = choice?.message?.content;

        if (!text) {
          const err = new Error("Model ne khali jawab diya");
          err.status = 502;
          throw err;
        }

        // Output beech mein kat gaya to kata hua JSON aage mat bhejo
        if (choice?.finish_reason === "length") {
          const err = new Error("Output token limit par kat gaya");
          err.status = 413;
          err.skipRetry = true;
          throw err;
        }

        if (json) text = extractJson(text);

        // Purane code ke saath compatible: result.response.text()
        return { response: { text: () => text } };
      } catch (e) {
        lastError = e;
        console.log(`${model} fail hua (status ${e.status || e.name}): ${e.message}`);
        // Timeout pe wahi model dobara mat try karo, seedha agle pe jao
        const retryable = !e.skipRetry && [502, 503].includes(e.status);
        if (!retryable) break;
        await sleep(1500 * attempt);
      }
    }
  }
  throw lastError;
}