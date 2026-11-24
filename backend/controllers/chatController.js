import { askCampusAI } from "../services/ai.js";

// POST /api/chat   body: { message: string, history?: [{ role: "user"|"model", text: string }] }
export async function chat(req, res) {
  const { message, history } = req.body ?? {};
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: "message too long (max 500 characters)" });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY server pe set nahi hai" });
  }

  try {
    const reply = await askCampusAI(message.trim(), Array.isArray(history) ? history : []);
    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(502).json({ error: "AI service abhi available nahi hai, thodi der baad try karo." });
  }
}
