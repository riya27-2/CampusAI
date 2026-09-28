import { useState } from "react";
import "./Syllabus.css";

const syllabusData = {
  CE: {
    name: "Computer Engineering",
    semesters: {
      1: [
        {
          name: "Mathematics - I",
          pdf: "/CE/Maths-I.pdf",
        },
        {
          name: "Programming for Problem Solving",
          pdf: "/CE/PPS.pdf",
        },
        {
          name: "Physics",
          pdf: "/CE/Physics.pdf",
        },
        {
          name: "Basic Electronics Engineering",
          pdf: "/CE/BEE.pdf",
        },
        {
          name: "Basic Mechanical Engineering",
          pdf: "/CE/BME.pdf",
        },
        {
          name: "Chemistry",
          pdf: "/CE/Chemistry.pdf",
        },
        {
          name: "Basic Electrical Engineering",
          pdf: "/CE/BEE - BE01R00051.pdf",
        },
        {
          name: "Programming for Problem Solving",
          pdf: "/CE/PPS.pdf",
        },
        {
          name: "Universal Human Values",
          pdf: "/CE/UHV.pdf",
        },{
          name: "Contributor Personality Development Program",
          pdf: "/CE/CPDP.pdf",
        },{
          name: "Integrated Personality Development Course",
          pdf: "/CE/IPDC.pdf",
        },
      ],

      2: [
        {
          name: "Mathematics - II",
          pdf: "/CE/Maths-2.pdf",
        },
        {
          name: "English for Technical Communication",
          pdf: "/CE/ETC.pdf",
        },
        {
          name: "Intellectual Property Rights",
          pdf: "/CE/IPR.pdf",
        },
        {
          name: "Engineering Graphics",
          pdf: "/CE/EGD.pdf",
        },{
          name: "Industrial Safety and Standards",
          pdf: "/CE/ISS.pdf",
        },
      ],

      3: [
        {
          name: "Probability and Statistics",
          pdf: "/CE/PS.pdf",
        },
        {
          name: "Database Management System",
          pdf: "/CE/DBMS.pdf",
        },
        {
          name: "Digital Fundamentals",
          pdf: "/CE/DF.pdf",
        },
        {
          name: "Data structure",
          pdf: "/CE/DS.pdf",
        },
        {
          name: "Professional Communication and Ethics",
          pdf: "/CE/PCE.pdf",
        },{
          name: "Indian Constitution",
          pdf: "/CE/IC.pdf",
        },{
          name: "Indian Knowledge System for Engineering",
          pdf: "/CE/IKS.pdf",
        },
      ],

      4: [
        {
          name: "Environmental Science, Sustainability and Renewable Energy",
          pdf: "/CE/ESSRE.pdf",
        },
        {
          name: "Operating System",
          pdf: "/CE/OS.pdf",
        },
        {
          name: "Object Oriented Programming",
          pdf: "/CE/OOP.pdf",
        },
        {
          name: "Analysis and Design of Algorithms",
          pdf: "/CE/ADA.pdf",
        },
        {
          name: "Computer Organization & Architecture",
          pdf: "/CE/COA.pdf",
        },
        {
          name: "Discrete Mathematics and Graph Theory",
          pdf: "/CE/DMGT.pdf",
        },
      ],

      5: [
        
        {
          name: "Advanced Java Programming",
          pdf: "/CE/AJP.pdf",
        },
        {
          name: "Computer Networks",
          pdf: "/CE/CN.pdf",
        },
        {
          name: "Data Mining Techniques",
          pdf: "/CE/DMT.pdf",
        },
        {
          name: "Python for Data Science",
          pdf: "/CE/PDS.pdf",
        },
        {
          name: "System Software",
          pdf: "/CE/SS.pdf",
        },
        {
          name:"Web Application Development",
          pdf: "/CE/WAD.pdf",
        },
        {
          name:"Microprocessor and Interfacing",
          pdf: "/CE/MI.pdf"
        }
      ],

      6: [
         {
          name: ".Net Technology",
          pdf: "/CE/",
        },
        {
          name: "Software Engineering",
          pdf: "/CE/",
        },
        {
          name: "Image Processing",
          pdf: "/CE/",
        },
        {
          name: "Big Data Analytics",
          pdf: "/CE/",
        },
        {
          name: "Data Visualization",
          pdf: "/CE/",
        },
        {
          name: "Digital Forensics",
          pdf: "/CE/",
        },
      ],
           //effective from 2020
      7: [
        {
          name: "Compiler Design",
          pdf: "/CE/CD.pdf",
        },
        {
          name: "Artificial Intelligence",
          pdf: "/CE/AI.pdf",
        },
        {
          name: "Cloud Computing",
          pdf: "/CE/CC.pdf",
        },
        {
          name: "Machine Learning",
          pdf: "/CE/ML.pdf",
        },
        {
          name: "Mobile Application Development",
          pdf: "/CE/MAD.pdf",
        },
        {
          name: "Information Security",
          pdf: "/CE/IS.pdf",
        },
        {
         name: "Summer Internship Report",
         pdf: "/CE/sem_7_report_final_bordered.pdf",
          },
        
      ],

      8: [
        
        {
          name: "Internship",
          pdf: "/CE/Internship-Project.pdf",
        },
        
      ],
    },
  },

  IT: {
    name: "Information Technology",
    semesters: {
      1: [
        {
          name: "Mathematics - I",
          pdf: "/CE/Maths-I.pdf",
        },
        {
          name: "Programming for Problem Solving",
          pdf: "/CE/PPS.pdf",
        },
        {
          name: "Physics",
          pdf: "/CE/Physics.pdf",
        },
        {
          name: "Basic Electronics Engineering",
          pdf: "/CE/BEE.pdf",
        },
        {
          name: "Basic Mechanical Engineering",
          pdf: "/CE/BME.pdf",
        },
        {
          name: "Chemistry",
          pdf: "/CE/Chemistry.pdf",
        },
        {
          name: "Basic Electrical Engineering",
          pdf: "/CE/BEE - BE01R00051.pdf",
        },
        {
          name: "Programming for Problem Solving",
          pdf: "/CE/PPS.pdf",
        },
        {
          name: "Universal Human Values",
          pdf: "/CE/UHV.pdf",
        },{
          name: "Contributor Personality Development Program",
          pdf: "/CE/CPDP.pdf",
        },{
          name: "Integrated Personality Development Course",
          pdf: "/CE/IPDC.pdf",
        },
      ],

      2: [
        {
          name: "Mathematics - II",
          pdf: "/CE/Maths-2.pdf",
        },
        {
          name: "English for Technical Communication",
          pdf: "/CE/ETC.pdf",
        },
        {
          name: "Intellectual Property Rights",
          pdf: "/CE/IPR.pdf",
        },
        {
          name: "Engineering Graphics",
          pdf: "/CE/EGD.pdf",
        },{
          name: "Industrial Safety and Standards",
          pdf: "/CE/ISS.pdf",
        },
      ],

      3: [
        {
          name: "Probability and Statistics",
          pdf: "/CE/PS.pdf",
        },
        {
          name: "Database Management System",
          pdf: "/CE/DBMS.pdf",
        },
        {
          name: "Digital Fundamentals",
          pdf: "/CE/DF.pdf",
        },
        {
          name: "Data structure",
          pdf: "/CE/DS.pdf",
        },
        {
          name: "Professional Communication and Ethics",
          pdf: "/CE/PCE.pdf",
        },{
          name: "Indian Constitution",
          pdf: "/CE/IC.pdf",
        },{
          name: "Indian Knowledge System for Engineering",
          pdf: "/CE/IKS.pdf",
        },
      ],

      4: [
        {
          name: "Environmental Science, Sustainability and Renewable Energy",
          pdf: "/CE/ESSRE.pdf",
        },
        {
          name: "Operating System",
          pdf: "/CE/OS.pdf",
        },
        {
          name: "Object Oriented Programming",
          pdf: "/CE/OOP.pdf",
        },
        {
          name: "Analysis and Design of Algorithms",
          pdf: "/CE/ADA.pdf",
        },
        {
          name: "Computer Organization & Architecture",
          pdf: "/CE/COA.pdf",
        },
        {
          name: "Discrete Mathematics and Graph Theory",
          pdf: "/CE/DMGT.pdf",
        },
      ],

      5: [
        
        {
          name: "Computer Graphics and Visualization",
          pdf: "/IT/CGV.pdf",
        },
        {
          name: "System Software",
          pdf: "/IT/SS.pdf",
        },
        {
          name: "Web Application Development",
          pdf: "/IT/WAD.pdf",
        },
        {
          name: "Cyber Security",
          pdf: "/IT/CS.pdf",
        },
        {
          name: "Data Science",
          pdf: "/IT/DS.pdf",
        },
        {
          name:"Advanced Database Management System",
          pdf: "/IT/ADBMS1.pdf",
        },
        {
          name:"Algorithm Analysis and Design",
          pdf: "/IT/ADBMS.pdf"
        }
      ],

      6: [
         {
          name: "Advanced Web Development",
          pdf: "/IT/",
        },
        {
          name: "Agile Development and UI/UX Design",
          pdf: "/IT/",
        },
        {
          name: "Data Analysis and Visualization",
          pdf: "/IT/",
        },
        {
          name: "Artificial Intelligence and Machine Learning",
          pdf: "/IT/",
        },
        {
          name: "Pattern Recognition",
          pdf: "/IT/",
        },
        {
          name: "Formal Language and Automata Theory",
          pdf: "/IT/",
        },
      ],
           //effective from 2020
      7: [
        {
          name: "Information Retrieval",
          pdf: "/IT/IR.pdf",
        },
        {
          name: "Internet of Things",
          pdf: "/IT/IoT.pdf",
        },
        {
          name: "Wireless Communication",
          pdf: "/IT/WC.pdf",
        },
        {
          name: "Agile Development and UI/UX Design",
          pdf: "/IT/AD-UIUX.pdf",
        },
        {
          name: "Graph Theory and Combinatorics",
          pdf: "/IT/GTC.pdf",
        },
        {
          name: "Software Project Management",
          pdf: "/IT/SPM (3).pdf",
        },
        {
         name: "Summer Internship Report",
         pdf: "/CE/sem_7_report_final_bordered.pdf",
          },
        
      ],

      8: [
        
        {
          name: "Internship",
          pdf: "/IT/Internship-Project (2).pdf",
        },
        
      ],
    },
  },
};

function Syllabus() {
  const [selectedBranch, setSelectedBranch] = useState("CE");
  const [selectedSemester, setSelectedSemester] = useState(1);

  const branch = syllabusData[selectedBranch];
  const subjects = branch.semesters[selectedSemester] || [];

  return (
    <div className="syllabus-page">

      <div className="syllabus-header">
        <h1>Syllabus</h1>
        <p>View semester-wise syllabus and subject documents</p>
      </div>

      {/* Branch Selection */}
      <div className="branch-section">
        <h2>Select Branch</h2>

        <div className="branch-buttons">
          {Object.entries(syllabusData).map(([key, value]) => (
            <button
              key={key}
              className={`branch-btn ${
                selectedBranch === key ? "active" : ""
              }`}
              onClick={() => {
                setSelectedBranch(key);
                setSelectedSemester(1);
              }}
            >
              {value.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Branch */}
      <div className="selected-branch">
        <h2 id="branch">{branch.name}</h2>
        <span>GTU Undergraduate Programme</span>
      </div>

      {/* Semester Tabs */}
      <div className="semester-section">
        <h3>Select Semester</h3>

        <div className="semester-tabs">
          {Object.keys(branch.semesters).map((semester) => (
            <button
              key={semester}
              className={`semester-btn ${
                selectedSemester === Number(semester) ? "active" : ""
              }`}
              onClick={() => setSelectedSemester(Number(semester))}
            >
              Semester {semester}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects */}
      <div className="subjects-section">
        <div className="semester-title">
          <h2>Semester {selectedSemester}</h2>
          <span>{subjects.length} Subjects</span>
        </div>

        <div className="subject-grid">
          {subjects.map((subject, index) => (
            <div className="subject-card" key={index}>
              <div className="subject-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="subject-info">
                <h3>{subject.name}</h3>
                <p>
                  {branch.name} • Semester {selectedSemester}
                </p>
              </div>

              <a
                href={subject.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-btn"
              >
                View PDF
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Syllabus;