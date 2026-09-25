import React from "react";
import "./FeeStructure.css";

const feeData = [
  {
    course: "Bachelor of Engineering",
    duration: "4 Years",
    semesters: "8",
    fees: "₹34,650/-",
  },
  {
    course: "Diploma",
    duration: "3 Years",
    semesters: "6",
    fees: "₹22,500/-",
  },
];

function FeeStructure() {
  return (
    <div className="fee-page">
      <div className="fee-header">
        <h1>Fee Structure</h1>
        <p>
          KJIT Campus-Savli offers affordable fees compared to other institutes
          in the region.
        </p>
      </div>

      <section className="fee-section">
        <h2>Course Fee Structure</h2>

        <div className="fee-table-wrapper">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Duration</th>
                <th>No. of Semesters</th>
                <th>Fees Per Semester (2026-27)</th>
              </tr>
            </thead>

            <tbody>
              {feeData.map((item, index) => (
                <tr key={index}>
                  <td>{item.course}</td>
                  <td>{item.duration}</td>
                  <td>{item.semesters}</td>
                  <td className="fee-amount">{item.fees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      
    </div>
  );
}

export default FeeStructure;