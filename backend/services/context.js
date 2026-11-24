// DB se college ka data nikaal ke AI ke liye ek compact text "knowledge base" banata hai.
// Itne chhote data ke liye vector DB / embeddings ki zarurat nahi, seedha prompt mein daal do.
import Subject from "../models/Subject.js";
import Department from "../models/Department.js";
import Course from "../models/Course.js";
import Info from "../models/Info.js";
import Notice from "../models/Notice.js";
import Event from "../models/Event.js";

const TTL_MS = 5 * 60 * 1000;
let cache = { text: "", at: 0 };

export async function getCollegeContext() {
  if (cache.text && Date.now() - cache.at < TTL_MS) return cache.text;

  const base = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
  const [subjects, departments, courses, infos, notices, events] = await Promise.all([
    Subject.find().sort({ branch: 1, semester: 1 }).lean(),
    Department.find().lean(),
    Course.find().lean(),
    Info.find().lean(),
    Notice.find().sort({ createdAt: -1 }).limit(10).lean(),
    Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(10).lean(),
  ]);

  const out = [];

  out.push("## COURSES OFFERED");
  for (const c of courses) out.push(`- [${c.level}] ${c.name}: ${c.seats} seats, ${c.duration}. ${c.description}`);

  out.push("\n## DEPARTMENTS, HOD & FACULTY");
  for (const d of departments) {
    out.push(`- ${d.name} (${d.code}) — ${d.description}`);
    out.push(`  HOD: ${d.hod?.name} (${d.hod?.phone})`);
    out.push(`  Faculty: ${d.faculty.map((f) => `${f.name} (${f.phone})`).join(", ")}`);
  }

  out.push("\n## SYLLABUS (branch / semester / subject)");
  const groups = {};
  for (const s of subjects) {
    const key = `${s.branch} Semester ${s.semester}`;
    (groups[key] ??= []).push(s.pdf ? `${s.name} [PDF: ${base}${encodeURI(s.pdf)}]` : `${s.name} [PDF not uploaded yet]`);
  }
  for (const [k, list] of Object.entries(groups)) out.push(`- ${k}: ${list.join("; ")}`);

  for (const i of infos) out.push(`\n## ${i.title.toUpperCase()}\n${JSON.stringify(i.data)}`);

  out.push("\n## RECENT NOTICES");
  for (const n of notices) out.push(`- ${n.title}: ${n.body} (${n.createdAt.toDateString()})`);

  out.push("\n## UPCOMING EVENTS");
  for (const e of events) out.push(`- ${e.title} on ${e.date.toDateString()}, ${e.time}, ${e.venue}`);

  cache = { text: out.join("\n"), at: Date.now() };
  return cache.text;
}

export function clearContextCache() {
  cache = { text: "", at: 0 };
}
