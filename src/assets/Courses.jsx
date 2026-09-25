import "./Courses.css";
import { useState } from "react";
import "./Courses.css";

function Courses() {
  const [activeTab, setActiveTab] = useState("degree");
const diplomaCourses = [
  {
    name: "Diploma in Mechanical Engineering",
    description:
      "Focuses on the design, analysis, and manufacturing of mechanical systems. Prepares students for careers in automotive, aerospace, energy, and production industries.",
    seats: 180,
    duration: "3 Years",
    icon: "⚙️",
  },
  {
    name: "Diploma in Electrical Engineering",
    description:
      "Covers power systems, control systems, and electrical machines. Equips students with skills to work in energy, automation, and industrial sectors.",
    seats: 90,
    duration: "3 Years",
    icon: "⚡",
  },
  {
    name: "Diploma in Civil Engineering",
    description:
      "Trains students in structural design, construction, and infrastructure development. Ideal for careers in real estate, urban planning, and government projects.",
    seats: 90,
    duration: "3 Years",
    icon: "🏗️",
  },
  {
    name: "Diploma in Computer Engineering",
    description:
      "Emphasizes digital systems, embedded technology, and communication networks. Suitable for roles in telecom, electronics, and IoT sectors.",
    seats: 60,
    duration: "3 Years",
    icon: "💻",
  },
];
  const degreeCourses = [
    {
      name: "Mechanical Engineering",
      description:
        "Focuses on the design, analysis, and manufacturing of mechanical systems. Prepares students for careers in automotive, aerospace, energy, and production industries.",
      seats: 90,
      duration: "4 Years",
      icon: "⚙️",
    },
    {
      name: "Electrical Engineering",
      description:
        "Covers power systems, control systems, and electrical machines. Equips students with skills to work in energy, automation, and industrial sectors.",
      seats: 60,
      duration: "4 Years",
      icon: "⚡",
    },
    {
      name: "Civil Engineering",
      description:
        "Trains students in structural design, construction, and infrastructure development. Ideal for careers in real estate, urban planning, and government projects.",
      seats: 30,
      duration: "4 Years",
      icon: "🏗️",
    },
   
    {
      name: "Automobile Engineering",
      description:
        "Focuses on automobile design, manufacturing, maintenance, vehicle systems, and modern automotive technologies.",
      seats: 30,
      duration: "4 Years",
      icon: "🚗",
    },
    {
      name: "Computer Engineering",
      description:
        "Focuses on programming, software development, databases, computer systems, and modern computing technologies.",
      seats: 60,
      duration: "4 Years",
      icon: "💻",
    },
    {
      name: "Information Technology",
      description:
        "Covers databases, networking, web technologies, and cybersecurity. Equips students for roles in IT services, data management, and technology consulting.",
      seats: 60,
      duration: "4 Years",
      icon: "🌐",
    },
  ];



  const courses =
    activeTab === "degree" ? degreeCourses : diplomaCourses;

  return (
    <div className="courses-page">

      <p className="courses-label">ACADEMICS</p>

      <h1>Courses</h1>

      <p className="courses-description">
        Explore degree and diploma programs offered by the institute.
      </p>

      {/* Tabs */}
      <div className="course-tabs">
        <button
          className={activeTab === "degree" ? "active" : ""}
          onClick={() => setActiveTab("degree")}
        >
          Degree
        </button>

        <button
          className={activeTab === "diploma" ? "active" : ""}
          onClick={() => setActiveTab("diploma")}
        >
          Diploma
        </button>
      </div>

      {/* Courses */}
      {courses.length > 0 ? (
        <div className="courses-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.name}>

              <div className="course-icon">
                {course.icon}
              </div>

              <div className="course-content">

                <h2>{course.name}</h2>

                <p>{course.description}</p>

                <div className="course-info">

                  <div className="course-info-item">
                    <span className="info-label">
                      Total Seats
                    </span>

                    <strong>
                      {course.seats} Seats
                    </strong>
                  </div>

                  <div className="course-info-item">
                    <span className="info-label">
                      Duration
                    </span>

                    <strong>
                      {course.duration}
                    </strong>
                  </div>

                </div>

                

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-courses">
          <div className="no-courses-icon">📚</div>

          <h2>No Diploma Courses Available</h2>

          <p>
            Diploma courses will be displayed here when available.
          </p>
        </div>
      )}

    </div>
  );
}

export default Courses;
