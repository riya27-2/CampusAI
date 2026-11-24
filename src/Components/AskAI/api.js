// Backend ka base URL. Vite use kar rahi ho to .env mein VITE_API_URL daalo,
// CRA hai to process.env.REACT_APP_API_URL use karna.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("token"); // apne login ke hisaab se key badlo
  // Agar tumhara backend sirf token expect karta hai (bina "Bearer"), to yahan se "Bearer " hata do.
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function askAI(question) {
  const res = await fetch(`${BASE}/api/ai/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ question }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data; // { answer, sources }
}

export async function uploadSyllabus({ file, course, totalSessions, minutesPerSession }) {
  const form = new FormData();
  form.append("file", file);
  form.append("course", course);
  form.append("totalSessions", totalSessions);
  form.append("minutesPerSession", minutesPerSession);

  // FormData ke saath Content-Type khud set mat karna, browser boundary laga deta hai
  const res = await fetch(`${BASE}/api/ai/syllabus`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data; // SessionPlan document
}