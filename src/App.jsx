import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./assets/Sidebar";
import Topbar from "./assets/Topbar";

import Dashboard from "./assets/dashboard";
import Academics from "./assets/Academic";

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
                path="/academics"
                element={<Academics />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;