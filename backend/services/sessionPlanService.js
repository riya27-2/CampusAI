import SessionPlan from "../models/SessionPlan.js";
import { generate } from "./gemini.js";

function extractJson(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model ne JSON nahi diya");
  return JSON.parse(clean.slice(start, end + 1));
}

export async function generateSessionPlan({
  syllabusText,
  course,
  totalSessions = 30,
  minutesPerSession = 60,
  professorId,
}) {
  const prompt = `You are an academic planner. From the syllabus below, create a
session-wise teaching plan with exactly ${totalSessions} sessions of
${minutesPerSession} minutes each.

Rules:
- Cover every unit/topic of the syllabus in logical order.
- Give heavier topics more sessions; include revision and 1-2 assessment sessions.
- Keep every string short (under 15 words) and use at most 3 items in each array.
- Return ONLY valid JSON in this shape:
{"sessions":[{"sessionNo":1,"topic":"","subtopics":[""],"objectives":[""],"activities":[""],"assessment":"","references":[""]}]}

SYLLABUS:
${syllabusText.slice(0, 30000)}`;

  let parsed = null;
  let lastError = null;

  // Parse fail ho to dobara generate karo (free models unreliable hote hain)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await generate({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const text = result.response.text();
      console.log(`Attempt ${attempt} RAW OUTPUT (first 300 chars):`, text.slice(0, 300));

      const candidate = extractJson(text);
      if (!Array.isArray(candidate.sessions) || candidate.sessions.length === 0) {
        throw new Error("sessions array missing ya empty");
      }
      parsed = candidate;
      break;
    } catch (err) {
      lastError = err;
      console.log(`Attempt ${attempt} fail: ${err.message}`);
    }
  }

  if (!parsed) throw lastError || new Error("Session plan generate nahi hua");

  // sessionNo hamesha sahi rahe
  const sessions = parsed.sessions.map((s, i) => ({
    ...s,
    sessionNo: s.sessionNo ?? i + 1,
  }));

  return SessionPlan.create({
    course,
    professor: professorId,
    totalSessions,
    minutesPerSession,
    sessions,
  });
}