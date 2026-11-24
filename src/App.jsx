import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

import Sidebar from "./assets/Sidebar";
import Topbar from "./assets/Topbar";
import Updates from "./assets/Updates";
import Dashboard from "./assets/dashboard";
import Departments from "./assets/Departments";
import Courses from "./assets/Courses";
import FeeStructure from "./assets/FeeStructure";
import StudentSupport from "./assets/StudentSupport";
import Syllabus from "./assets/Syllabus";
import Gtu from "./assets/Gtu";
import SyllabusPlanner from "./assets/syllabusPlanner";
import AuthPages from "./Pages/AuthPages";

import "./assets/dashboard.css";

/* Role Based Route Protection */
function RoleRoute({ roles, children }) {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  return roles.includes(role) ? children : <Navigate to="/" replace />;
}

/* Main layout: sirf login ke baad dikhega */
function Layout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/Updates" element={<Updates />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/FeeStructure" element={<FeeStructure />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/gtu-papers" element={<Gtu />} />

            <Route
              path="/syllabusplanner"
              element={
                <RoleRoute roles={["professor"]}>
                  <SyllabusPlanner />
                </RoleRoute>
              }
            />

            <Route
              path="/StudentSupport"
              element={
                <RoleRoute roles={["student"]}>
                  <StudentSupport />
                </RoleRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <AuthPages />}
      />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}

export default App;