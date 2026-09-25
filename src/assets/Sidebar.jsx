import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <div className="logo-icon">C</div>

        <div>
          <h2 id="campus">CampusAI</h2>
          <span>Smart College Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">

        <NavLink to="/" end>
          ⌂ Dashboard
        </NavLink>

       
        <NavLink to="/departments">
          ▦ Departments
        </NavLink>

        <NavLink to="/courses">
          📚 Courses
        </NavLink>

        <NavLink to="/FeeStructure">
          💰 Fee Structure
        </NavLink>

       

        <NavLink to="/syllabus">
          📄 Syllabus
        </NavLink>

        <NavLink to="/notices">
          📢 Notices
        </NavLink>

        <NavLink to="/events">
          🎉 Events
        </NavLink>
        <NavLink to="/StudentSupport">
          💰 Student Support
        </NavLink>

      </nav>

      <div className="sidebar-bottom">
        <a href="#">↪ Logout</a>
      </div>

    </aside>
  );
}

export default Sidebar;