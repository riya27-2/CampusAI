
import { useEffect, useState } from "react";
import "./Syllabus.css";
import { api } from "../api"; // Import path apne project ke hisaab se check karo
import { useAuth } from "../Context/AuthContext"; // Import path check karo

function Syllabus() {
  const { user } = useAuth();

  const isProfessor = user?.role === "professor";

  const [selectedDept, setSelectedDept] = useState("CE");
  const [selectedSemester, setSelectedSemester] = useState(1);

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subjectName, setSubjectName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function loadSyllabus() {
    try {
      setLoading(true);
      setError("");

      const data = await api(
        `/syllabus?dept=${selectedDept}&semester=${selectedSemester}`
      );

      setSubjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSyllabus();
  }, [selectedDept, selectedSemester]);

  async function handleUpload(e) {
    e.preventDefault();

    if (!subjectName.trim() || !pdfFile) {
      setError("Subject name and PDF are required.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("dept", selectedDept);
      formData.append("semester", selectedSemester);
      formData.append("subjectName", subjectName);
      formData.append("file", pdfFile);

      await api("/syllabus", {
        method: "POST",
        body: formData,
      });

      setSubjectName("");
      setPdfFile(null);
      e.target.reset();

      await loadSyllabus();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this syllabus?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api(`/syllabus/${id}`, {
        method: "DELETE",
      });

      await loadSyllabus();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="syllabus-page">
      <div className="syllabus-header">
        <h1>Syllabus</h1>
      </div>

      {/* Department Tabs */}
      <div className="syllabus-dept-tabs">
        {["CE", "IT"].map((dept) => (
          <button
            key={dept}
            className={`syllabus-dept-btn ${
              selectedDept === dept ? "active" : ""
            }`}
            onClick={() => {
              setSelectedDept(dept);
              setSelectedSemester(1);
            }}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Semester Tabs */}
      <div className="syllabus-semester-tabs">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
          <button
            key={semester}
            className={`syllabus-semester-btn ${
              selectedSemester === semester ? "active" : ""
            }`}
            onClick={() => setSelectedSemester(semester)}
          >
            Semester {semester}
          </button>
        ))}
      </div>

      {/* Professor Only: Add Syllabus */}
      {isProfessor && (
        <form className="syllabus-upload-form" onSubmit={handleUpload}>
          <h2>Add New Syllabus</h2>

          <input
            type="text"
            placeholder="Enter subject name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />

          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setPdfFile(e.target.files[0] || null)}
            required
          />

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Syllabus"}
          </button>
        </form>
      )}

      {error && <p className="syllabus-error">{error}</p>}

      {/* Syllabus List */}
      <div className="syllabus-subject-grid">
        {loading ? (
          <p>Loading syllabus...</p>
        ) : subjects.length === 0 ? (
          <p>No syllabus available for this semester.</p>
        ) : (
          subjects.map((subject) => (
            <div className="syllabus-subject-card" key={subject._id}>
              <div className="syllabus-subject-info">
                <h3>{subject.subjectName}</h3>
              </div>

              <a
                href={subject.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="syllabus-pdf-btn"
              >
                View PDF
              </a>

              {isProfessor && (
                <button
                  type="button"
                  className="syllabus-delete-btn"
                  onClick={() => handleDelete(subject._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Syllabus;
