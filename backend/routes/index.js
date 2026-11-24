import { Router } from "express";
import rateLimit from "express-rate-limit";
import { wrap } from "../middleware/errorHandler.js";
import * as data from "../controllers/dataController.js";
import { chat } from "../controllers/chatController.js";

const router = Router();

// AI endpoint pe limit, warna Gemini ka free quota jaldi khatam ho jayega
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Bahut zyada requests, 1 minute baad try karo." },
});

router.get("/health", (req, res) => res.json({ ok: true }));

router.get("/subjects", wrap(data.getSubjects));
router.get("/departments", wrap(data.getDepartments));
router.get("/departments/:code", wrap(data.getDepartmentByCode));
router.get("/courses", wrap(data.getCourses));
router.get("/info/:key", wrap(data.getInfo));
router.get("/notices", wrap(data.getNotices));
router.get("/events", wrap(data.getEvents));
router.get("/search", wrap(data.search));

router.post("/chat", chatLimiter, wrap(chat));

export default router;
