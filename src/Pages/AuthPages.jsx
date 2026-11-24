import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./AuthPages.css";

const ROLES = [
  { value: "student", label: "Student", hint: "Learn and ask the AI" },
  { value: "professor", label: "Professor", hint: "Create session plans" },
];

const FEATURES = [
  "Get instant AI answers to your college questions",
  "Turn a syllabus into a session plan with one upload",
  "Separate access for students and professors",
];

function EyeIcon({ off }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      {off && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function switchMode(next) {
    setMode(next);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await signup(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="au">
      <aside className="au-brand">
        <div className="au-logo">
          <span className="au-logo-mark">C</span>
          CampusAI
        </div>

        <div>
          <h1>Your smart campus assistant</h1>
          <p className="au-brand-text">
            Studying, planning and college information, all in one place.
          </p>
          <ul className="au-features">
            {FEATURES.map((f) => (
              <li key={f}>
                <span className="au-tick">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="au-foot">© {new Date().getFullYear()} CampusAI</p>
      </aside>

      <main className="au-main">
        <form className="au-card" onSubmit={handleSubmit}>
          <div className="au-mobile-logo">
            <span className="au-logo-mark">C</span>
            CampusAI
          </div>

          <div className="au-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={isLogin}
              className={isLogin ? "on" : ""} onClick={() => switchMode("login")}>
              Login
            </button>
            <button type="button" role="tab" aria-selected={!isLogin}
              className={!isLogin ? "on" : ""} onClick={() => switchMode("signup")}>
              Sign up
            </button>
          </div>

          <div>
            <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p className="au-sub">
              {isLogin
                ? "Log in to your account to continue."
                : "It only takes a few seconds."}
            </p>
          </div>

          {!isLogin && (
            <label className="au-field">
              <span>Full name</span>
              <input value={form.name} onChange={set("name")} placeholder="e.g. Riya Patel"
                autoComplete="name" required />
            </label>
          )}

          <label className="au-field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com"
              autoComplete="email" required />
          </label>

          <label className="au-field">
            <span>Password</span>
            <div className="au-pw">
              <input type={showPw ? "text" : "password"} minLength={6} value={form.password}
                onChange={set("password")} placeholder="At least 6 characters"
                autoComplete={isLogin ? "current-password" : "new-password"} required />
              <button type="button" className="au-eye" onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? "Hide password" : "Show password"}>
                <EyeIcon off={showPw} />
              </button>
            </div>
          </label>

          {!isLogin && (
            <div className="au-field">
              <span>I am a</span>
              <div className="au-roles">
                {ROLES.map((r) => (
                  <button key={r.value} type="button" aria-pressed={form.role === r.value}
                    className={`au-role ${form.role === r.value ? "on" : ""}`}
                    onClick={() => setForm({ ...form, role: r.value })}>
                    <strong>{r.label}</strong>
                    <small>{r.hint}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div className="au-error" role="alert">{error}</div>}

          <button type="submit" className="au-submit" disabled={busy}>
            {busy && <span className="au-spin" />}
            {busy ? "Please wait..." : isLogin ? "Log in" : "Create account"}
          </button>

          <p className="au-switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => switchMode(isLogin ? "signup" : "login")}>
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}