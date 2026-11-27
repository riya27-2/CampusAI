
import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import Syllabus from "../models/syllabus.js";
import cloudinary from "../config/cloudinary.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// PDF memory mein temporarily rahegi; server disk par save nahi hogi.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

function handleUpload(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (!err) return next();

    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "PDF size must be less than 10 MB"
        : err.message;

    return res.status(400).json({ error: message });
  });
}

// Upload PDF buffer to Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const publicId = `campusai/syllabus/${crypto.randomUUID()}.pdf`;

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: publicId,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

// Delete PDF from Cloudinary
async function deleteFromCloudinary(publicId) {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
}

// GET: Students and professors can view syllabus
router.get("/", requireAuth, async (req, res) => {
  try {
    const filter = {};

    if (req.query.dept) filter.dept = req.query.dept;
    if (req.query.semester) filter.semester = Number(req.query.semester);

    const syllabus = await Syllabus.find(filter)
      .select("-cloudinaryPublicId")
      .sort({ dept: 1, semester: 1, subjectName: 1 });

    res.json(syllabus);
  } catch (error) {
    console.error("SYLLABUS FETCH ERROR:", error);
    res.status(500).json({ error: "Could not load syllabus" });
  }
});

// POST: Only professors can add syllabus
router.post(
  "/",
  requireAuth,
  requireRole("professor"),
  handleUpload,
  async (req, res) => {
    let uploadedFile;

    try {
      const { dept, semester, subjectName } = req.body;

      if (!["CE", "IT"].includes(dept)) {
        return res.status(400).json({ error: "Invalid department" });
      }

      const sem = Number(semester);

      if (!Number.isInteger(sem) || sem < 1 || sem > 8) {
        return res.status(400).json({ error: "Invalid semester" });
      }

      if (!subjectName?.trim()) {
        return res.status(400).json({ error: "Subject name is required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" });
      }

      uploadedFile = await uploadToCloudinary(req.file.buffer);

      const syllabus = await Syllabus.create({
        dept,
        semester: sem,
        subjectName: subjectName.trim(),
        pdfUrl: uploadedFile.secure_url,
        cloudinaryPublicId: uploadedFile.public_id,
        fileName: (req.file.originalname || "syllabus.pdf").slice(0, 120),
        contentType: "application/pdf",
        createdBy: req.user._id,
      });

      res.status(201).json(syllabus);
    } catch (error) {
      if (uploadedFile?.public_id) {
        await deleteFromCloudinary(uploadedFile.public_id).catch(() => {});
      }

      console.error("SYLLABUS CREATE ERROR:", error);
      res.status(500).json({ error: "Could not upload syllabus" });
    }
  }
);

// PUT: Only professors can update syllabus
router.put(
  "/:id",
  requireAuth,
  requireRole("professor"),
  handleUpload,
  async (req, res) => {
    let newFile;

    try {
      const syllabus = await Syllabus.findById(req.params.id);

      if (!syllabus) {
        return res.status(404).json({ error: "Syllabus not found" });
      }

      const { dept, semester, subjectName } = req.body;

      if (dept !== undefined) {
        if (!["CE", "IT"].includes(dept)) {
          return res.status(400).json({ error: "Invalid department" });
        }
        syllabus.dept = dept;
      }

      if (semester !== undefined) {
        const sem = Number(semester);
        if (!Number.isInteger(sem) || sem < 1 || sem > 8) {
          return res.status(400).json({ error: "Invalid semester" });
        }
        syllabus.semester = sem;
      }

      if (subjectName !== undefined) {
        if (!subjectName.trim()) {
          return res.status(400).json({ error: "Subject name is required" });
        }
        syllabus.subjectName = subjectName.trim();
      }

      if (req.file) {
        newFile = await uploadToCloudinary(req.file.buffer);

        const oldPublicId = syllabus.cloudinaryPublicId;

        syllabus.pdfUrl = newFile.secure_url;
        syllabus.cloudinaryPublicId = newFile.public_id;
        syllabus.fileName = (req.file.originalname || "syllabus.pdf").slice(0, 120);
        syllabus.contentType = "application/pdf";

        await syllabus.save();

        await deleteFromCloudinary(oldPublicId).catch((error) => {
          console.error("OLD PDF DELETE ERROR:", error);
        });
      } else {
        await syllabus.save();
      }

      res.json(syllabus);
    } catch (error) {
      if (newFile?.public_id) {
        await deleteFromCloudinary(newFile.public_id).catch(() => {});
      }

      console.error("SYLLABUS UPDATE ERROR:", error);
      res.status(500).json({ error: "Could not update syllabus" });
    }
  }
);

// DELETE: Only professors can delete syllabus
router.delete(
  "/:id",
  requireAuth,
  requireRole("professor"),
  async (req, res) => {
    try {
      const syllabus = await Syllabus.findById(req.params.id);

      if (!syllabus) {
        return res.status(404).json({ error: "Syllabus not found" });
      }

      await syllabus.deleteOne();

      await deleteFromCloudinary(syllabus.cloudinaryPublicId).catch((error) => {
        console.error("CLOUDINARY DELETE ERROR:", error);
      });

      res.json({ ok: true });
    } catch (error) {
      console.error("SYLLABUS DELETE ERROR:", error);
      res.status(500).json({ error: "Could not delete syllabus" });
    }
  }
);

export default router;
