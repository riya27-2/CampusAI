import "./dashboard.css";

function Dashboard() {
  return (
    <section className="dashboard">

      {/* Welcome */}
      <div className="welcome">
        <div>
          <p className="small-title">WELCOME TO CAMPUSAI</p>

          <h1>
            Smart College.
            <br />
            Smarter Learning.
          </h1>

          <p>
            Manage academics, discover learning resources and
            get assistance from AI — all in one place.
          </p>

          <button className="primary-btn">
            🤖 Ask CampusAI
          </button>
        </div>

        <div className="welcome-icon">
          🤖
        </div>
      </div>

      {/* Statistics */}
      <div className="stats">

        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div>
            <span>Total Students</span>
            <h2>1,250</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div>
            <span>Faculty Members</span>
            <h2>85</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div>
            <span>Courses</span>
            <h2>32</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div>
            <span>Departments</span>
            <h2>8</h2>
          </div>
        </div>

      </div>

      {/* Middle Section */}
      <div className="content-grid">

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Upcoming Events</h3>
              <p>What's happening at college</p>
            </div>

            <button>View All</button>
          </div>

          <div className="event">
            <div className="date">
              <strong>25</strong>
              <span>SEP</span>
            </div>

            <div>
              <h4>AI & Machine Learning Workshop</h4>
              <p>10:00 AM • Seminar Hall</p>
            </div>
          </div>

          <div className="event">
            <div className="date">
              <strong>28</strong>
              <span>SEP</span>
            </div>

            <div>
              <h4>Tech Fest 2026</h4>
              <p>9:00 AM • College Campus</p>
            </div>
          </div>

          <div className="event">
            <div className="date">
              <strong>02</strong>
              <span>OCT</span>
            </div>

            <div>
              <h4>Guest Lecture</h4>
              <p>11:00 AM • Auditorium</p>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Recent Notices</h3>
              <p>Latest college announcements</p>
            </div>

            <button>View All</button>
          </div>

          <div className="notice">
            <div className="notice-icon">📢</div>

            <div>
              <h4>Mid-Semester Examination</h4>
              <p>Exam schedule has been published.</p>
              <span>2 hours ago</span>
            </div>
          </div>

          <div className="notice">
            <div className="notice-icon">📚</div>

            <div>
              <h4>New Study Material</h4>
              <p>New notes have been uploaded.</p>
              <span>Yesterday</span>
            </div>
          </div>

          <div className="notice">
            <div className="notice-icon">🎓</div>

            <div>
              <h4>Academic Calendar</h4>
              <p>Updated academic calendar is available.</p>
              <span>2 days ago</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Assistant */}
      <div className="ai-card">

        <div className="ai-icon">🤖</div>

        <div className="ai-content">
          <span>AI POWERED</span>

          <h2>Meet your CampusAI Assistant</h2>

          <p>
            Ask questions about courses, syllabus, college
            information, notes and academic resources.
          </p>

          <div className="ai-input">
            <input
              type="text"
              placeholder="Ask something like: What subjects are in Semester 7?"
            />

            <button>Ask AI →</button>
          </div>
        </div>

      </div>

      {/* Academic Content */}
      <div className="card academic-card">

        <div className="card-header">
          <div>
            <h3>Recent Academic Content</h3>
            <p>Recently added learning resources</p>
          </div>

          <button>View All</button>
        </div>

        <div className="academic-list">

          <div className="academic-item">
            <div className="file-icon">📄</div>

            <div>
              <h4>Artificial Intelligence - Unit 2 Notes</h4>
              <p>
                Uploaded by Prof. Rahul Patel • 2 hours ago
              </p>
            </div>

            <button>View</button>
          </div>

          <div className="academic-item">
            <div className="file-icon">📝</div>

            <div>
              <h4>Database Management Assignment</h4>
              <p>Semester 7 • Due 30 September</p>
            </div>

            <button>View</button>
          </div>

          <div className="academic-item">
            <div className="file-icon">📊</div>

            <div>
              <h4>Web Development Session Plan</h4>
              <p>Semester 7 • 15 Sessions</p>
            </div>

            <button>View</button>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Dashboard;