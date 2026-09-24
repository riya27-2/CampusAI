function Topbar() {
  return (
    <header className="topbar">

      <div className="search">
        <span>🔍</span>

        <input
          type="text"
          placeholder="Search courses, faculty, notices..."
        />
      </div>

      <div className="top-actions">

        <button className="notification">
          🔔
        </button>

        <div className="profile">

          <div className="avatar">
            RA
          </div>

          <div>
            <strong>Riya Arvindbhai</strong>
            <span>Student</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;