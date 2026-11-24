import Subject from "../models/Subject.js";
import Department from "../models/Department.js";
import Course from "../models/Course.js";
import Info from "../models/Info.js";
import Notice from "../models/Notice.js";
import Event from "../models/Event.js";

// GET /api/subjects?branch=CE&semester=7   (frontend ke syllabusData jaisa nested format chahiye to ?grouped=true)
export async function getSubjects(req, res) {
  const filter = {};
  if (req.query.branch) filter.branch = String(req.query.branch).toUpperCase();
  if (req.query.semester) filter.semester = Number(req.query.semester);
  const subjects = await Subject.find(filter).sort({ branch: 1, semester: 1, name: 1 }).lean();

  if (req.query.grouped !== "true") return res.json(subjects);

  const grouped = {};
  for (const s of subjects) {
    grouped[s.branch] ??= {};
    (grouped[s.branch][s.semester] ??= []).push({ name: s.name, pdf: s.pdf });
  }
  res.json(grouped);
}

export async function getDepartments(req, res) {
  res.json(await Department.find().lean());
}

export async function getDepartmentByCode(req, res) {
  const dep = await Department.findOne({ code: req.params.code.toUpperCase() }).lean();
  if (!dep) return res.status(404).json({ error: "Department not found" });
  res.json(dep);
}

// GET /api/courses?level=degree|diploma
export async function getCourses(req, res) {
  const filter = req.query.level ? { level: req.query.level } : {};
  res.json(await Course.find(filter).lean());
}

// GET /api/info/fees  |  /api/info/student-support
export async function getInfo(req, res) {
  const info = await Info.findOne({ key: req.params.key }).lean();
  if (!info) return res.status(404).json({ error: "Not found" });
  res.json(info);
}

export async function getNotices(req, res) {
  res.json(await Notice.find().sort({ createdAt: -1 }).limit(Number(req.query.limit) || 20).lean());
}

// Default: aaj ke baad ke events. ?all=true se sab.
export async function getEvents(req, res) {
  const filter = req.query.all === "true" ? {} : { date: { $gte: new Date() } };
  res.json(await Event.find(filter).sort({ date: 1 }).lean());
}

// GET /api/search?q=...  (Topbar search bar ke liye)
export async function search(req, res) {
  const q = String(req.query.q || "").trim().slice(0, 60);
  if (q.length < 2) return res.json({ subjects: [], departments: [], courses: [] });
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [subjects, departments, courses] = await Promise.all([
    Subject.find({ name: rx }).limit(15).lean(),
    Department.find({ $or: [{ name: rx }, { "hod.name": rx }, { "faculty.name": rx }] })
      .select("code name hod").limit(10).lean(),
    Course.find({ name: rx }).limit(10).lean(),
  ]);
  res.json({ subjects, departments, courses });
}
