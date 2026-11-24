import { useState } from "react";
import { uploadSyllabus } from "./api";
import "./ask-ai.css";

export default function SyllabusUpload() {
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState("");
  const [totalSessions, setTotalSessions] = useState(30);
  const [minutesPerSession, setMinutesPerSession] = useState(60);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !course.trim()) {
      setError("Course name aur syllabus file dono zaroori hain.");
      return;
    }
    setError("");
    setPlan(null);
    setLoading(true);
    try {
      const data = await uploadSyllabus({ file, course, totalSessions, minutesPerSession });
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="syl-wrap">
      <form className="syl-form" onSubmit={handleSubmit}>
        <h2>Session plan banao</h2>

        <label>
          Course name
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. Data Structures" />
        </label>

        <div className="syl-row">
          <label>
            Total sessions
            <input type="number" min="1" max="100" value={totalSessions}
              onChange={(e) => setTotalSessions(e.target.value)} />
          </label>
          <label>
            Minutes per session
            <input type="number" min="15" max="180" value={minutesPerSession}
              onChange={(e) => setMinutesPerSession(e.target.value)} />
          </label>
        </div>

        <label>
          Syllabus (PDF ya .txt)
          <input type="file" accept=".pdf,.txt,.md" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        {error && <p className="syl-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Plan ban raha hai…" : "Generate plan"}
        </button>
      </form>

      {plan && (
        <div className="syl-plan">
          <h3>{plan.course} · {plan.sessions.length} sessions</h3>
          {plan.sessions.map((s) => (
            <details key={s.sessionNo} className="syl-session">
              <summary>Session {s.sessionNo}: {s.topic}</summary>
              <Block title="Subtopics" items={s.subtopics} />
              <Block title="Objectives" items={s.objectives} />
              <Block title="Activities" items={s.activities} />
              {s.assessment && <p><strong>Assessment:</strong> {s.assessment}</p>}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function Block({ title, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <strong>{title}</strong>
      <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  );
}
