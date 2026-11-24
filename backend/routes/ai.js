import express from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { answerQuestion, ingest } from "../services/ragService.js";
import { generateSessionPlan } from "../services/sessionPlanService.js";
import SessionPlan from "../models/SessionPlan.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

async function fileToText(file) {
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: new Uint8Array(file.buffer) });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }
  return file.buffer.toString("utf-8"); // .txt / .md
}

// Student aur professor dono: "Ask AI"
router.post("/ask", requireAuth, async (req, res) => {
  try {
    const { question } = req.body;
    console.log("ASK aaya:", question);
    if (!question?.trim()) return res.status(400).json({ error: "Question required" });
    const data = await answerQuestion(question);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong", detail: e.message });
  }
});

// Professor: college info upload (RAG knowledge base)
router.post("/ingest", requireAuth, requireRole("professor"), upload.single("file"), async (req, res) => {
  try {
    const text = await fileToText(req.file);
    const count = await ingest(text, { source: "college", uploadedBy: req.user.id });
    res.json({ chunks: count });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not ingest file" });
  }
});

// Professor: syllabus upload -> session plan
router.post("/syllabus", requireAuth, requireRole("professor"), upload.single("file"), async (req, res) => {
  try {
    const { course, totalSessions, minutesPerSession } = req.body;
    const syllabusText = await fileToText(req.file);

    const plan = await generateSessionPlan({
      syllabusText,
      course,
      totalSessions: Number(totalSessions) || 30,
      minutesPerSession: Number(minutesPerSession) || 60,
      professorId: req.user._id,
    });

    // Syllabus ko RAG mein bhi daal do, taaki students us course ke sawal puch sakein
    await ingest(syllabusText, { source: "syllabus", course, uploadedBy: req.user.id });

    res.json(plan);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not generate session plan", detail: e.message });
  }
});

router.get("/session-plans", requireAuth, requireRole("professor"), async (req, res) => {
  res.json(await SessionPlan.find({ professor: req.user._id }).sort("-createdAt"));
});

export default router;