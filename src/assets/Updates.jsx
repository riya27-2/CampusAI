import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./Updates.css";
const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");
const MAX_MB = 5;

const TYPES = {
  assignment: { label: "Assignment", dateLabel: "Due" },
  event: { label: "Event", dateLabel: "Date" },
  placement: { label: "Placement", dateLabel: "Apply by" },
};

// Event aur Placement: sirf message + optional image
const SIMPLE_TYPES = ["event", "placement"];

const TABS = [
  ["all", "All"],
  ["assignment", "Assignments"],
  ["event", "Events"],
  ["placement", "Placements"],
];

const EMPTY = { title: "", description: "", date: "", course: "", link: "" };

function headers() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const fileUrl = (f) => `${API}/uploads/${f.filename}`;

export default function Updates() {
  const { user } = useAuth();
  const isProfessor = user?.role === "professor";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [formType, setFormType] = useState(null); // null = form band, warna "assignment" / "event" / "placement"
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0); // file input ko reset karne ke liye
  const [saving, setSaving] = useState(false);

  const isSimple = SIMPLE_TYPES.includes(formType);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function load() {
    try {
      const res = await fetch(`${API}/api/posts`, { headers: headers() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setForm(EMPTY);
    setFile(null);
    setFileKey((k) => k + 1);
    setError("");
  }

  // Same button dobara dabane par form band ho jata hai
  function openForm(type) {
    resetForm();
    setFormType(formType === type ? null : type);
  }

  function handleFile(e) {
    const f = e.target.files[0] || null;
    let problem = "";
    if (f && f.size > MAX_MB * 1024 * 1024) problem = `File is too large (max ${MAX_MB} MB)`;
    else if (f && isSimple && !f.type.startsWith("image/")) problem = "Please choose an image";

    if (problem) {
      setError(problem);
      setFileKey((k) => k + 1);
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (isSimple && !form.description.trim() && !file) {
      setError("Write a message or add an image");
      return;
    }

    setSaving(true);
    try {
      // File ke saath bhejna hai, isliye FormData (Content-Type browser khud set karta hai)
      const body = new FormData();
      body.append("type", formType);
      if (isSimple) {
        body.append("description", form.description);
      } else {
        Object.entries(form).forEach(([k, v]) => body.append(k, v));
      }
      if (file) body.append("file", file);

      const res = await fetch(`${API}/api/posts`, { method: "POST", headers: headers(), body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setPosts([data, ...posts]);
      setTab(formType); // naya post usi tab mein dikhe
      setFormType(null);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this update?")) return;
    try {
      const res = await fetch(`${API}/api/posts/${id}`, { method: "DELETE", headers: headers() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const visible = tab === "all" ? posts : posts.filter((p) => p.type === tab);
  const today = new Date().setHours(0, 0, 0, 0);

  return (
    <div className="up">

      <div className="up-head">
        <div>
          <h2>Campus Updates</h2>
          <p>Updates shared by your professors.</p>
        </div>

        {isProfessor && (
          <div className="up-btns">
            {Object.entries(TYPES).map(([v, t]) => (
              <button key={v} className={`up-add ${formType === v ? "on" : ""}`} onClick={() => openForm(v)}>
                {formType === v ? `Close ${t.label.toLowerCase()}` : `+ ${t.label}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {isProfessor && formType && (
        <form className="up-card up-form" onSubmit={handleSubmit}>
          <h3 className="up-form-title">New {TYPES[formType].label.toLowerCase()}</h3>

          {isSimple ? (
            <>
              <label>
                Message
                <textarea rows={4} value={form.description} onChange={set("description")}
                  placeholder="Write your message for students..." />
              </label>

              <label>
                Add an image (optional, max {MAX_MB} MB)
                <input key={fileKey} type="file" accept=".jpg,.jpeg,.png,.webp,image/*"
                  onChange={handleFile} />
              </label>
            </>
          ) : (
            <>
              <div className="up-row">
                <label>
                  Title
                  <input value={form.title} onChange={set("title")} placeholder="e.g. Unit 3 assignment" required />
                </label>
                <label>
                  {TYPES[formType].dateLabel} date
                  <input type="date" value={form.date} onChange={set("date")} />
                </label>
              </div>

              <label>
                Details
                <textarea rows={4} value={form.description} onChange={set("description")}
                  placeholder="Instructions, submission details, etc." />
              </label>

              <div className="up-row">
                <label>
                  Course (optional)
                  <input value={form.course} onChange={set("course")} placeholder="e.g. Data Structures" />
                </label>
                <label>
                  Link (optional)
                  <input value={form.link} onChange={set("link")} placeholder="https://..." />
                </label>
              </div>

              <label>
                Attach a PDF or image (optional, max {MAX_MB} MB)
                <input key={fileKey} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                  onChange={handleFile} />
              </label>
            </>
          )}

          <button type="submit" className="up-primary" disabled={saving}>
            {saving ? "Posting..." : `Post ${TYPES[formType].label.toLowerCase()}`}
          </button>
        </form>
      )}

      <div className="up-tabs">
        {TABS.map(([v, label]) => (
          <button key={v} className={tab === v ? "on" : ""} onClick={() => setTab(v)}>
            {label}
          </button>
        ))}
      </div>

      {error && <div className="up-error">{error}</div>}
      {loading && <p className="up-muted">Loading...</p>}
      {!loading && visible.length === 0 && (
        <p className="up-muted">
          {isProfessor ? "Nothing here yet. Post the first update." : "No updates yet. Check back soon."}
        </p>
      )}

      <div className="up-list">
        {visible.map((p) => {
          const closed = p.type === "assignment" && p.date && new Date(p.date) < today;
          const mine = isProfessor && p.createdBy?._id === user.id;
          const isImage = p.file?.mimetype?.startsWith("image/");
          const isPdf = p.file?.mimetype === "application/pdf";

          return (
            <article key={p._id} className="up-card">
              {(p.course || closed) && (
                <div className="up-top">
                  {p.course && <span className="up-course">{p.course}</span>}
                  {closed && <span className="up-closed">Closed</span>}
                </div>
              )}

              {p.title && <h3>{p.title}</h3>}
              {p.description && (
                <p className={p.title ? "up-desc" : "up-desc up-msg"}>{p.description}</p>
              )}

              {isImage && (
                <a href={fileUrl(p.file)} target="_blank" rel="noopener noreferrer">
                  <img className="up-img" src={fileUrl(p.file)} alt={p.file.originalName || "Update image"} />
                </a>
              )}

              {isPdf && (
                <a className="up-pdf" href={fileUrl(p.file)} target="_blank" rel="noopener noreferrer">
                  <span className="up-pdf-icon">PDF</span>
                  <span className="up-pdf-name">{p.file.originalName || "Document.pdf"}</span>
                  <span className="up-pdf-open">Open PDF</span>
                </a>
              )}

              <div className="up-meta">
                {p.date && <span><strong>{TYPES[p.type].dateLabel}:</strong> {formatDate(p.date)}</span>}
                <span>Posted by {p.createdBy?.name || "Professor"} · {formatDate(p.createdAt)}</span>
              </div>

              <div className="up-actions">
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="up-link">
                    Open link
                  </a>
                )}
                {mine && (
                  <button className="up-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

