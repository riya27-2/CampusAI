import { useState } from "react";
import "./Gtu.css";

/* ---------- CE SUBJECTS (Syllabus.jsx ke hisaab se) ---------- */
const SUBJECTS = {
  1: [
    "Mathematics - I",
    "Programming for Problem Solving",
    "Physics",
    "Basic Electronics Engineering",
    "Basic Mechanical Engineering",
    "Chemistry",
    "Basic Electrical Engineering",
    "Universal Human Values",
    "Contributor Personality Development Program",
    "Integrated Personality Development Course",
  ],
  2: [
    "Mathematics - II",
    "English for Technical Communication",
    "Intellectual Property Rights",
    "Engineering Graphics",
    "Industrial Safety and Standards",
  ],
  3: [
    "Probability and Statistics",
    "Database Management System",
    "Digital Fundamentals",
    "Data structure",
    "Professional Communication and Ethics",
    "Indian Constitution",
    "Indian Knowledge System for Engineering",
  ],
  4: [
    "Environmental Science, Sustainability and Renewable Energy",
    "Operating System",
    "Object Oriented Programming",
    "Analysis and Design of Algorithms",
    "Computer Organization & Architecture",
    "Discrete Mathematics and Graph Theory",
  ],
  5: [
    "Advanced Java Programming",
    "Computer Networks",
    "Data Mining Techniques",
    "Python for Data Science",
    "System Software",
    "Web Application Development",
    "Microprocessor and Interfacing",
  ],
  6: [
    ".Net Technology",
    "Software Engineering",
    "Image Processing",
    "Big Data Analytics",
    "Data Visualization",
    "Digital Forensics",
  ],
  7: [
    "Compiler Design",
    "Artificial Intelligence",
    "Cloud Computing",
    "Machine Learning",
    "Mobile Application Development",
    "Information Security",
  ],
  8: ["Internship"],
};

const PAPERS = {
  1: {
    "Mathematics - I": [
      { title: "Summer 2026", file: "/sem 1/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 1/W2025.pdf" },
     { title: "Summer 2025", file: "/sem 1/S2025.pdf" },

    ],
     "Programming for Problem Solving": [
    { title: "Summer 2026", file: "/sem 1/PPS/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 1/PPS/W2025.pdf" },
  ],
  Physics: [
    { title: "Summer 2026", file: "/sem 1/Physics/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 1/Physics/W2025.pdf" },
  ],
  "Basic Electronics Engineering": [
    { title: "Summer 2026", file: "/sem 1/BEE/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 1/BEE/W2025.pdf" },
  ],
  "Basic Mechanical Engineering": [
    { title: "Summer 2026", file: "/sem 1/BME/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 1/BME/W2025.pdf" },
  ],
  Chemistry: [
    { title: "Summer 2026", file: "/sem 1/Chemistry/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 1/Chemistry/W2025.pdf" },
    { title: "Summer 2025", file: "/sem 1/Chemistry/S2025.pdf" },
  ],
  "Basic Electrical Engineering": [
    { title: "Summer 2026", file: "/sem 1/BEE-Electrical/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 1/BEE-Electrical/W2025.pdf" },
  ],
  "Universal Human Values": [
    { title: "Summer 2026", file: "/sem 1/UHV/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 1/UHV/W2025.pdf" },
  ],
  "Contributor Personality Development Program": [
    { title: "Winter 2025", file: "/sem 1/CPDP/W2024.pdf" },
    { title: "Summer 2025", file: "/sem 1/CPDP/S2025.pdf" },
  ],
 
  },
    2: {
    "Mathematics - II": [
      { title: "Summer 2026", file: "/sem 2/Maths2/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 2/Maths2/W2025.pdf" },
    ],
    "English for Technical Communication": [
      { title: "Summer 2026", file: "/sem 2/ETC/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 2/ETC/W2025.pdf" },
    ],
    "Intellectual Property Rights": [
      { title: "Summer 2026", file: "/sem 2/IPR/S2026.pdf" },
    ],
  
    "Industrial Safety and Standards": [
      { title: "Summer 2026", file: "/sem 2/ISS/S2026.pdf" },
    ],
  },  3: {
    "Probability and Statistics": [
      { title: "Summer 2026", file: "/sem 3/PS/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 3/PS/W2025.pdf" },
    ],
    "Database Management System": [
      { title: "Summer 2026", file: "/sem 3/DBMS/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 3/DBMS/W2025.pdf" },
    ],
    "Digital Fundamentals": [
      { title: "Summer 2026", file: "/sem 3/DF/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 3/DF/W2025.pdf" },
    ],
    "Data structure": [
      { title: "Summer 2026", file: "/sem 3/DS/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 3/DS/W2025.pdf" },
    ],
    
    "Indian Constitution": [
      { title: "Summer 2026", file: "/sem 3/IC/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 3/IC/W2025.pdf" },
      
    ],
   
  },
    4: {
    "Principal of Economics and Managenent": [
      { title: "Summer 2026", file: "/sem 4/PEM/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 4/PEM/W2025.pdf" },
    ],
    "Operating System": [
      { title: "Summer 2026", file: "/sem 4/OS/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 4/OS/W2025.pdf" },
    ],
    "Object Oriented Programming": [
      { title: "Summer 2026", file: "/sem 4/OOP/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 4/OOP/W2025.pdf" },
    ],
    "Analysis and Design of Algorithms": [
      { title: "Summer 2026", file: "/sem 4/ADA/S2026.pdf" },
    ],
    "Computer Organization & Architecture": [
      { title: "Summer 2026", file: "/sem 4/COA/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 4/COA/W2025.pdf" },
    ],
    "Discrete Mathematics": [
      { title: "Summer 2026", file: "/sem 4/DMGT/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 4/DMGT/W2025.pdf" },
    ],
  },
  5: {
    "Advanced Java Programming": [
      { title: "Summer 2026", file: "/sem 5/AJP/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 5/AJP/W2025.pdf" },
    ],
    "Computer Networks": [
      { title: "Summer 2026", file: "/sem 5/CN/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 5/CN/W2025.pdf" },
    ],
   
    "Software Engineer": [
      { title: "Summer 2026", file: "/sem 5/SS/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 5/SS/W2025.pdf" },
    ],
    "Web Application Development": [
      { title: "Summer 2026", file: "/sem 5/WAD/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 5/WAD/W2025.pdf" },
    ],
    "Microprocessor and Interfacing": [
      { title: "Summer 2026", file: "/sem 5/MI/S2026.pdf" },
      { title: "Winter 2025", file: "/sem 5/MI/W2025.pdf" },
    ],
  },
  6: {
  ".Net Technology": [
    { title: "Summer 2026", file: "/sem 6/DOTNET/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 6/DOTNET/W2025.pdf" },
  ],
  "Thoery of Computation": [
    { title: "Summer 2026", file: "/sem 6/TOC/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 6/TOC/W2025.pdf" },
  ],
  "System Software": [
    { title: "Summer 2026", file: "/sem 6/SS/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 6/SS/W2025.pdf" },
  ],
  "Data Visualization": [
    { title: "Summer 2026", file: "/sem 6/DV/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 6/DV/W2025.pdf" },
  ],
 
},

7: {
  "Compiler Design": [
    { title: "Summer 2026", file: "/sem 7/CD/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 7/CD/W2025.pdf" },
  ],
  "Artificial Intelligence": [
    { title: "Summer 2026", file: "/sem 7/AI/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 7/AI/W2025.pdf" },
  ],
  "Cloud Computing": [
    { title: "Summer 2026", file: "/sem 7/CC/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 7/CC/W2025.pdf" },
  ],
  "Machine Learning": [
    { title: "Summer 2026", file: "/sem 7/ML/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 7/ML/W2025.pdf" },
  ],
  "Mobile Application Development": [
    { title: "Summer 2026", file: "/sem 7/MAD/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 7/MAD/W2025.pdf" },
  ],
  "Information Security": [
    { title: "Summer 2026", file: "/sem 7/IS/S2026.pdf" },
    { title: "Winter 2025", file: "/sem 7/IS/W2025.pdf" },
  ],
},
};

function Gtu() {
  const [sem, setSem] = useState(1);
  const [subject, setSubject] = useState(null);

  const subjects = SUBJECTS[sem] || [];
  const papers = subject ? PAPERS[sem]?.[subject] || [] : [];

  const changeSem = (s) => {
    setSem(s);
    setSubject(null);
  };

  return (
    <div className="gtu-page">
      <div className="gtu-header">
        <h1>Previous GTU Papers - Computer Engineering</h1>
      </div>

      {/* Semester Tabs */}
      <div className="gtu-sem-tabs">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <button
            key={s}
            className={`gtu-sem-btn ${sem === s ? "active" : ""}`}
            onClick={() => changeSem(s)}
          >
            Semester {s}
          </button>
        ))}
      </div>

      {/* Subjects List */}
      {!subject && (
        <div className="gtu-subject-grid">
          {subjects.map((name) => (
            <button
              key={name}
              className="gtu-subject-card"
              onClick={() => setSubject(name)}
            >
              <h3>{name}</h3>
              <span className="gtu-arrow">→</span>
            </button>
          ))}
        </div>
      )}

      {/* Papers List */}
      {subject && (
        <div className="gtu-papers-section">
          <button className="gtu-back-btn" onClick={() => setSubject(null)}>
            ← Back to subjects
          </button>

          <h2 className="gtu-papers-title">{subject}</h2>

          {papers.length === 0 ? (
            <div className="gtu-empty">
              Is subject ke papers abhi add nahi hue hain.
            </div>
          ) : (
            <div className="gtu-papers-grid">
              {papers.map((p, i) => (
                <div className="gtu-paper-card" key={i}>
                  <div className="gtu-paper-info">
                    <h3>{p.title}</h3>
                    <small>CE · Semester {sem}</small>
                  </div>

                  <div className="gtu-paper-actions">
                    <a
                      href={p.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gtu-view-btn"
                    >
                      View
                    </a>
                    <a href={p.file} download className="gtu-download-btn">
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Gtu;