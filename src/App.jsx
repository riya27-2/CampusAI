import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./assets/Sidebar";
import Topbar from "./assets/Topbar";

import Dashboard from "./assets/dashboard";
import Departments from "./assets/Departments";
import Courses from "./assets/Courses";
import FeeStructure from "./assets/FeeStructure";
import StudentSupport from "./assets/StudentSupport";

import "./assets/dashboard.css";

function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">

        {/* Common Sidebar */}
        <Sidebar />

        {/* Right Side */}
        <div className="main-area">

          {/* Common Topbar */}
          <Topbar />

          {/* Page Content */}
          <main className="page-content">

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/Departments"
                element={<Departments />}
              />
              <Route
                path="/Courses"
                element={<Courses />}
              />
              <Route
                path="/FeeStructure"
                element={<FeeStructure />}
              />
               <Route
                path="/StudentSupport"
                element={<StudentSupport />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;