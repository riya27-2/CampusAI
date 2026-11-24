import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Subject from "../models/Subject.js";
import Department from "../models/Department.js";
import Course from "../models/Course.js";
import Info from "../models/Info.js";
import Notice from "../models/Notice.js";
import Event from "../models/Event.js";

import syllabusData from "./syllabusData.js";
import departments from "./departments.js";
import degreeCourses from "./degreeCourses.js";
import diplomaCourses from "./diplomaCourses.js";
import feeData from "./feeData.js";

// Subjects: frontend ke nested object ko flat rows mein badlo
const subjectMap = new Map();
for (const [branch, b] of Object.entries(syllabusData)) {
  for (const [sem, list] of Object.entries(b.semesters)) {
    for (const s of list) {
      const pdf = s.pdf && !s.pdf.endsWith("/") ? s.pdf : null; // "/CE/" jaise adhure paths -> null
      subjectMap.set(`${branch}|${sem}|${s.name}`, { branch, semester: Number(sem), name: s.name, pdf });
    }
  }
}

const studentSupport = [
  { title: "TFW – Tuition Fee Waiver Scheme", text: "Tuition Fee Waiver (TFW) Scheme is applicable to the college. Admissions are conducted through ACPC / ACPDC Admission Committee." },
  { title: "Scholarship", text: "S.C., S.T., SEBC and EBC students can get scholarships as per the Government of Gujarat norms." },
  { title: "Travel Concession", text: "S.T. students can apply for bus and railway concession passes. Students should contact their respective department." },
  { title: "Education Loan", text: "Students can get education loans from nationalized banks without guarantor or mortgage, subject to applicable bank rules." },
  { title: "Financial Assistance", text: "Students facing financial difficulties can meet the higher authority along with their parents to discuss available assistance." },
];

async function run() {
  await connectDB();
  await Promise.all([Subject, Department, Course, Info, Notice, Event].map((m) => m.deleteMany({})));

  await Subject.insertMany([...subjectMap.values()]);
  await Department.insertMany(departments);
  await Course.insertMany([
    ...degreeCourses.map((c) => ({ ...c, level: "degree" })),
    ...diplomaCourses.map((c) => ({ ...c, level: "diploma" })),
  ]);
  await Info.insertMany([
    { key: "fees", title: "Fee Structure (2026-27)", data: feeData },
    { key: "student-support", title: "Student Support & Financial Assistance", data: studentSupport },
  ]);
  // Sample data (dashboard se). Asli notices/events baad mein admin API se daalna.
  await Notice.insertMany([
    { title: "Mid-Semester Examination", body: "Exam schedule has been published.", icon: "📢" },
    { title: "New Study Material", body: "New notes have been uploaded.", icon: "📚" },
    { title: "Academic Calendar", body: "Updated academic calendar is available.", icon: "🎓" },
  ]);
  await Event.insertMany([
    { title: "AI & Machine Learning Workshop", date: "2026-09-25", time: "10:00 AM", venue: "Seminar Hall" },
    { title: "Tech Fest 2026", date: "2026-09-28", time: "9:00 AM", venue: "College Campus" },
    { title: "Guest Lecture", date: "2026-10-02", time: "11:00 AM", venue: "Auditorium" },
  ]);

  console.log(`Seeded: ${subjectMap.size} subjects, ${departments.length} departments, ${degreeCourses.length + diplomaCourses.length} courses`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
