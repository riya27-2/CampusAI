import React from "react";
import "./StudentSupport.css";

function StudentSupport() {
  return (
    <div className="student-support-page">

      <div className="student-support-header">
        <h1>Student Support & Financial Assistance</h1>
        <p>
          Various financial assistance and student support facilities
          available at the college.
        </p>
      </div>

      <div className="support-grid">

        <div className="support-card">
          <h2>TFW – Tuition Fee Waiver Scheme</h2>
          <p>
            Tuition Fee Waiver (TFW) Scheme is applicable to the college.
            Admissions are conducted through ACPC / ACPDC Admission Committee.
          </p>
        </div>

        <div className="support-card">
          <h2>Scholarship</h2>
          <p>
            S.C., S.T., SEBC and EBC students can get scholarships as per
            the Government of Gujarat norms.
          </p>
        </div>

        <div className="support-card">
          <h2>Travel Concession</h2>
          <p>
            S.T. students can apply for bus and railway concession passes.
            Students should contact their respective department.
          </p>
        </div>

        <div className="support-card">
          <h2>Education Loan</h2>
          <p>
            Students can get education loans from nationalized banks without
            guarantor or mortgage, subject to applicable bank rules.
          </p>
        </div>

        <div className="support-card full-width">
          <h2>Financial Assistance</h2>
          <p>
            Students facing financial difficulties can meet the higher
            authority along with their parents to discuss available assistance.
          </p>
        </div>

      </div>
    </div>
  );
}

export default StudentSupport;