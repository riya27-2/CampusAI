import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Notice ki sirf headline: title ho to wahi, warna message ki pehli line
function headline(p) {
  const text = (p.title || p.description || "").trim().split("\n")[0];
  if (!text) return "Image update";
  return text.length > 90 ? text.slice(0, 90) + "…" : text;
}

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, postsRes] = await Promise.all([
          fetch(`${API}/api/dashboard/stats`, { headers: authHeaders() }),
          fetch(`${API}/api/posts`, { headers: authHeaders() }),
        ]);
        const statsData = await statsRes.json();
        const postsData = await postsRes.json();
        if (!statsRes.ok) throw new Error(statsData.error || "Could not load stats");
        if (!postsRes.ok) throw new Error(postsData.error || "Could not load notices");
        setStats(statsData);
        setNotices(postsData.slice(0, 5)); // backend naye-se-purane order mein deta hai
      } catch (err) {
        console.error(err);
        setDataError(err.message);
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, []);

  async function askAI() {
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch(`${API}/api/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Request failed");
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const muted = { color: "#6b7280", fontSize: 14, padding: "12px 0" };

  return (
    <section className="dashboard">

      {dataError && <p style={{ color: "#b42318", fontSize: 14 }}>{dataError}</p>}

      {/* Registered users */}
      <div className="stats" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>

        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div>
            <span>Registered Students</span>
            <h2>{stats ? stats.students.toLocaleString("en-IN") : "–"}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div>
            <span>Registered Faculty</span>
            <h2>{stats ? stats.professors.toLocaleString("en-IN") : "–"}</h2>
          </div>
        </div>

      </div>

      {/* Recent Notices: sirf headlines */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3>Recent Notices</h3>
            <p>Latest announcements</p>
          </div>

          <button onClick={() => navigate("/Updates")}>View All</button>
        </div>

        {dataLoading && <p style={muted}>Loading...</p>}
        {!dataLoading && notices.length === 0 && <p style={muted}>No notices yet.</p>}

        {notices.map((p) => (
          <div
            className="notice"
            key={p._id}
            onClick={() => navigate("/Updates")}
            style={{ cursor: "pointer" }}
          >
            <div className="notice-icon">📢</div>

            <div>
              <h4>{headline(p)}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant */}
      <div className="ai-card" id="ask-ai">

        <div className="ai-icon">🤖</div>

        <div className="ai-content">
          <span>AI POWERED</span>

          <h2>Meet your CampusAI Assistant</h2>

          <p>
            Ask questions about courses, syllabus, college
            information, notes and academic resources.
          </p>

          <div className="ai-input">
            <input
              type="text"
              placeholder="Ask something like: What subjects are in Semester 7?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askAI()}
            />

            <button onClick={askAI} disabled={loading}>
              {loading ? "Thinking..." : "Ask AI →"}
            </button>
          </div>

          {answer && (
            <p style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{answer}</p>
          )}
        </div>

      </div>

    </section>
  );
}

export default Dashboard;