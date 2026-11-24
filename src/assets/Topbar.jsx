import { useAuth } from "../Context/AuthContext";
import "./Topbar.css";
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Topbar() {
  const { user, logout } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] || "";
  if (!user) return null;

  const roleLabel = user.role === "professor" ? "Professor" : "Student";

  return (
    <header className="topbar">

     <div className="topbar-left">
  <h2 className="topbar-welcome">Welcome back, {firstName}</h2>
</div>

      <div className="top-actions">

        <button className="notification">
          🔔
        </button>

        <div className="profile" title={user.email} id="profile">

          <div className="avatar">
            {getInitials(user.name)}
          </div>

          <div>
            <strong>{user.name}</strong>
            <span>{roleLabel}</span>
          </div>

        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

    </header>
  );
}



export default Topbar;