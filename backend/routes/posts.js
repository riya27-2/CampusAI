import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import Post from "../models/Post.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const TYPES = ["assignment", "event", "placement"];
const SIMPLE_TYPES = ["event", "placement"]; // sirf message + optional image

// ---------- File upload setup ----------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Sirf ye types allow hain. SVG jaan-boojh ke nahi, kyunki usme script ho sakti hai.
const EXT = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + EXT[file.mimetype]),
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) =>
    EXT[file.mimetype]
      ? cb(null, true)
      : cb(new Error("Only PDF, JPG, PNG or WebP files are allowed")),
});

function handleUpload(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (!err) return next();
    const msg = err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 5 MB)" : err.message;
    res.status(400).json({ error: msg });
  });
}

const removeFile = (filename) =>
  filename ? fs.promises.unlink(path.join(UPLOAD_DIR, filename)).catch(() => {}) : null;

// Validation fail ho to upload hui file bhi hata do
async function reject(req, res, message) {
  await removeFile(req.file?.filename);
  return res.status(400).json({ error: message });
}

// ---------- Routes ----------

// Student aur professor, dono dekh sakte hain
router.get("/", requireAuth, async (req, res) => {
  try {
    const filter = TYPES.includes(req.query.type) ? { type: req.query.type } : {};
    const posts = await Post.find(filter).populate("createdBy", "name").sort("-createdAt");
    res.json(posts);
  } catch (err) {
    console.error("POSTS LIST ERROR:", err);
    res.status(500).json({ error: "Could not load updates" });
  }
});

// Sirf professor post kar sakta hai (login aur role check upload se PEHLE hota hai)
router.post("/", requireAuth, requireRole("professor"), handleUpload, async (req, res) => {
  try {
    const { type, title, description, date, link, course } = req.body;

    if (!TYPES.includes(type)) return reject(req, res, "Invalid type");

    const simple = SIMPLE_TYPES.includes(type);

    if (simple) {
      // Event / Placement: message ya image, koi ek to chahiye
      if (!description?.trim() && !req.file)
        return reject(req, res, "Write a message or add an image");
      if (req.file && !req.file.mimetype.startsWith("image/"))
        return reject(req, res, "Only an image can be attached to this update");
    } else {
      // Assignment
      if (!title?.trim()) return reject(req, res, "Title is required");
      // Students is link par click karenge, isliye sirf http/https allow karo
      if (link && !/^https?:\/\//i.test(link.trim()))
        return reject(req, res, "Link must start with http:// or https://");
    }

    const post = await Post.create({
      type,
      title: simple ? "" : title,
      description,
      date: simple ? undefined : date || undefined,
      link: simple ? "" : link,
      course: simple ? "" : course,
      file: req.file
        ? {
            filename: req.file.filename,
            originalName: (req.file.originalname || "file").slice(0, 120),
            mimetype: req.file.mimetype,
          }
        : undefined,
      createdBy: req.user._id,
    });
    await post.populate("createdBy", "name");
    res.status(201).json(post);
  } catch (err) {
    await removeFile(req.file?.filename);
    console.error("POST CREATE ERROR:", err);
    res.status(500).json({ error: "Could not create the update" });
  }
});

// Professor sirf apna post delete kar sakta hai (file bhi hat jati hai)
router.delete("/:id", requireAuth, requireRole("professor"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Update not found" });
    if (String(post.createdBy) !== String(req.user._id))
      return res.status(403).json({ error: "You can delete only your own updates" });

    await removeFile(post.file?.filename);
    await post.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error("POST DELETE ERROR:", err);
    res.status(500).json({ error: "Could not delete the update" });
  }
});

export default router;