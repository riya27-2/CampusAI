
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !role)
      return res.status(400).json({
        error: "Name, email, password, and role are required."
      });

    if (!["student", "professor"].includes(role))
      return res.status(400).json({
        error: "Role must be either student or professor."
      });

    if (password.length < 6)
      return res.status(400).json({
        error: "Password must be at least 6 characters long."
      });

    const exists = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (exists)
      return res.status(409).json({
        error: "An account with this email already exists."
      });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      role
    });

    res.status(201).json({
      token: sign(user),
      user: publicUser(user)
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({
      error: "Signup failed. Please try again."
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        error: "Please enter both email and password."
      });

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    const ok = user && (await bcrypt.compare(password, user.password));

    if (!ok)
      return res.status(401).json({
        error: "Invalid email or password. Please check your email and password and try again."
      });

    res.json({
      token: sign(user),
      user: publicUser(user)
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      error: "Login failed. Please try again."
    });
  }
});

// Identify the logged-in user after page refresh
router.get("/me", requireAuth, (req, res) =>
  res.json({ user: publicUser(req.user) })
);

export default router;
