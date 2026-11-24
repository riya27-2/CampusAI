import RagChunk from "../models/RagChunk.js";
import { embed, generate } from "./gemini.js";

// ---------- 1. Chunking ----------
function chunkText(text, size = 800, overlap = 150) {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks = [];
  for (let i = 0; i < clean.length; i += size - overlap) {
    chunks.push(clean.slice(i, i + size));
  }
  return chunks;
}

// ---------- 2. Ingest (admin / professor upload) ----------
export async function ingest(text, { source = "college", course, uploadedBy } = {}) {
  const pieces = chunkText(text);
  const docs = [];
  for (const piece of pieces) {
    docs.push({ text: piece, embedding: await embed(piece), source, course, uploadedBy });
  }
  await RagChunk.insertMany(docs);
  return docs.length;
}

// ---------- 3. Retrieve ----------
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// Simple version: in-memory cosine. Chunks hazaaron mein jaayein to
// MongoDB Atlas Vector Search pe shift kar lena.
export async function retrieve(question, k = 5) {
  const qVec = await embed(question);
  const all = await RagChunk.find({}).select("text embedding source course").lean();
  return all
    .map((c) => ({ ...c, score: cosine(qVec, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

// ---------- 4. Answer ----------
export async function answerQuestion(question) {
  const top = await retrieve(question);
  const context = top.map((c, i) => `[${i + 1}] ${c.text}`).join("\n\n");

  const prompt = `You are the Campus AI assistant for students.
Answer ONLY using the context below. If the answer is not in the context,
say you don't have that information and suggest contacting the college office.
Keep the answer clear and short. Reply in the same language as the question.

CONTEXT:
${context}

QUESTION: ${question}`;

  const result = await generate(prompt);
  return {
    answer: result.response.text(),
    sources: top.map((c) => ({ source: c.source, course: c.course, score: c.score })),
  };
}