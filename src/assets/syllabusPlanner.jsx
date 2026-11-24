import { useState } from "react";
import "./Syllabusplanner.css";
// Backend ka address. Agar VITE_API_URL ke aakhir mein /api likha ho to wo hata diya jaata hai.
const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");

export default function SyllabusPlanner() {
  const [course, setCourse] = useState("");
  const [totalSessions, setTotalSessions] = useState(30);
  const [minutesPerSession, setMinutesPerSession] = useState(60);
  const [file, setFile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!course.trim() || !file) {
      setError("Course ka naam aur syllabus file dono zaroori hain.");
      return;
    }

    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("course", course.trim());
      form.append("totalSessions", totalSessions);
      form.append("minutesPerSession", minutesPerSession);

      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/ai/syllabus`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form, // Content-Type khud set mat karna, browser kar deta hai
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Request failed");
      setPlan(data);
    } catch (err) {
      console.error(err);
      setError("Session plan nahi ban paya. Thodi der baad dobara try karo. (" + err.message + ")");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sp">
      <style>{css}</style>

      <form className="sp-card" onSubmit={handleSubmit}>
        <h3>Session Plan Generator</h3>
        <p className="sp-hint">Syllabus upload karo, AI session-wise teaching plan bana dega.</p>

        <label>
          Course 
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="ex: Data Structures" />
        </label>

        <div className="sp-row">
          <label>
            Total sessions
            <input type="number" min="1" max="100" value={totalSessions}
              onChange={(e) => setTotalSessions(e.target.value)} />
          </label>
          <label>
            Har session (minutes)
            <input type="number" min="15" max="180" value={minutesPerSession}
              onChange={(e) => setMinutesPerSession(e.target.value)} />
          </label>
        </div>

        <label>
          Syllabus file (PDF ya .txt)
          <input type="file" accept=".pdf,.txt,.md" onChange={(e) => setFile(e.target.files[0] || null)} />
        </label>

        {error && <p className="sp-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Plan ban raha hai… (1-2 minute lag sakte hain)" : "Generate Session Plan"}
        </button>
      </form>

      {plan && (
        <div className="sp-card sp-plan">
          <h3>{plan.course} · {plan.sessions.length} sessions</h3>

          {plan.sessions.map((s) => (
            <details key={s.sessionNo} className="sp-session">
              <summary>Session {s.sessionNo}: {s.topic}</summary>
              <List title="Subtopics" items={s.subtopics} />
              <List title="Objectives" items={s.objectives} />
              <List title="Activities" items={s.activities} />
              {s.assessment && <p><strong>Assessment:</strong> {s.assessment}</p>}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function List({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <strong>{title}</strong>
      <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  );
}

const css = `
.sp { display: flex; flex-direction: column; gap: 20px; max-width: 760px; }
.sp-card {
  background: #ffffff; color: #111827; border: 1px solid #e5e7eb;
  border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 14px;
}
.sp-card h3 { margin: 0; font-size: 20px; }
.sp-hint { margin: 0; font-size: 14px; color: #6b7280; }
.sp-card label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500; }
.sp-card input {
  padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 10px;
  font: inherit; font-weight: 400; background: #ffffff; color: #111827;
}
.sp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.sp-card button[type="submit"] {
  align-self: flex-start; border: 0; border-radius: 10px; padding: 11px 22px;
  background: #4f46e5; color: #ffffff; font: inherit; font-size: 15px; cursor: pointer;
}
.sp-card button[type="submit"]:disabled { opacity: 0.6; cursor: progress; }
.sp-card button:focus-visible, .sp-card input:focus-visible { outline: 2px solid #4f46e5; outline-offset: 2px; }
.sp-error { margin: 0; font-size: 14px; color: #b42318; }

.sp-session { border: 1px solid #e5e7eb; border-radius: 12px; padding: 10px 14px; }
.sp-session summary { cursor: pointer; font-weight: 600; }
.sp-session ul { margin: 4px 0 10px; padding-left: 20px; font-size: 14px; }
.sp-session p { margin: 6px 0 0; font-size: 14px; }

@media (max-width: 560px) { .sp-row { grid-template-columns: 1fr; } }
`;