import { createContext, useContext, useEffect, useState } from "react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Page refresh par token se user wapas load karo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  async function signup(form) {
    const data = await post("/api/auth/signup", form);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function login(email, password) {
    const data = await post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}