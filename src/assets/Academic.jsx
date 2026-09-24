function Academics() {
  return (
    <div className="page-content">
      <p className="page-label">ACADEMICS</p>

      <h1>Academic Overview</h1>

      <p className="page-description">
        Explore courses, departments, syllabus and academic resources.
      </p>

      <div className="academic-grid">

        <div className="academic-card">
          <div className="academic-card-icon">🏢</div>
          <h2>Departments</h2>
          <p>
            Explore all college departments and academic programs.
          </p>
          <button>View Departments →</button>
        </div>

        <div className="academic-card">
          <div className="academic-card-icon">📚</div>
          <h2>Courses</h2>
          <p>
            Browse available courses and programs.
          </p>
          <button>View Courses →</button>
        </div>

        <div className="academic-card">
          <div className="academic-card-icon">📄</div>
          <h2>Syllabus</h2>
          <p>
            Access semester-wise syllabus and subjects.
          </p>
          <button>View Syllabus →</button>
        </div>

        <div className="academic-card">
          <div className="academic-card-icon">📅</div>
          <h2>Academic Calendar</h2>
          <p>
            Check important academic dates and schedules.
          </p>
          <button>View Calendar →</button>
        </div>

      </div>
    </div>
  );
}

export default Academics;