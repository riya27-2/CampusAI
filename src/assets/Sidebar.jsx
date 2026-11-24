import { useAuth } from "../Context/AuthContext";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const { user } = useAuth();

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

       <NavLink to="/Updates">🔔 Updates</NavLink>

        <NavLink to="/syllabus">
          📄 Syllabus
        </NavLink>
       
       <NavLink to="/gtu-papers">
  📚 Previous GTU Papers
</NavLink>
       {user?.role === "professor" && (
  <NavLink to="/syllabusplanner">🗓️ Syllabus Planner</NavLink>
)}
       
{user?.role === "student" && (
  <NavLink to="/StudentSupport">🤝 Student Support</NavLink>
)}

      </nav>

      

    </aside>
  );
}

export default Sidebar;