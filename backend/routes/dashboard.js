import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Kitne students aur faculty ne register kiya hai
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const [students, professors] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "professor" }),
    ]);
    res.json({ students, professors });
  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);
    res.status(500).json({ error: "Could not load dashboard stats" });
  }
});

export default router;