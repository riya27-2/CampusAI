# CampusAI Backend

Node + Express + MongoDB + Gemini.

## Run karna

```bash
cd backend
npm install
cp .env.example .env      # phir .env mein MONGODB_URI aur GEMINI_API_KEY bharo
npm run seed              # frontend ka hardcoded data MongoDB mein daal deta hai
npm run dev               # http://localhost:5000
```

Test: http://localhost:5000/api/health aur http://localhost:5000/api/subjects?branch=CE&semester=7

Gemini key: https://aistudio.google.com/apikey (free tier hai).

## API

| Method | Route | Kaam |
|---|---|---|
| GET | `/api/subjects?branch=CE&semester=7` | Syllabus subjects (`&grouped=true` = frontend ke `syllabusData` jaisa format) |
| GET | `/api/departments`, `/api/departments/CE` | Departments, HOD, faculty |
| GET | `/api/courses?level=degree` | Courses (degree / diploma) |
| GET | `/api/info/fees`, `/api/info/student-support` | Fee structure, student support |
| GET | `/api/notices`, `/api/events` | Dashboard ke notices / upcoming events |
| GET | `/api/search?q=java` | Topbar search |
| POST | `/api/chat` | AI chat. Body: `{ "message": "...", "history": [{ "role": "user", "text": "..." }] }` |

## Frontend se connect karna

Frontend mein `.env` banao: `VITE_API_URL=http://localhost:5000/api`

`src/api.js`:
```js
const API = import.meta.env.VITE_API_URL;

export async function api(path, options) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
```

Dashboard ka "Ask AI" box (chat):
```jsx
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [loading, setLoading] = useState(false);

async function ask() {
  if (!question.trim()) return;
  setLoading(true);
  try {
    const { reply } = await api("/chat", { method: "POST", body: JSON.stringify({ message: question }) });
    setAnswer(reply);
  } catch (e) {
    setAnswer(e.message);
  } finally {
    setLoading(false);
  }
}
// <input value={question} onChange={(e) => setQuestion(e.target.value)} />
// <button onClick={ask} disabled={loading}>{loading ? "..." : "Ask AI →"}</button>
// <p>{answer}</p>
```

Syllabus page: `syllabusData` constant hata ke `useEffect` mein `api("/subjects?grouped=true")` call karo.
Phir `subjects = data[selectedBranch]?.[selectedSemester] || []`.

## Notes

- AI ko pura college data prompt mein diya jata hai (5 min cache). Is size ke data ke liye vector DB / RAG ki zarurat nahi.
- `GEMINI_MODEL` .env se badal sakti ho agar model name purana ho jaye.
- Abhi login/auth nahi hai (frontend mein bhi login page nahi hai). Next step: JWT auth + admin routes (notices/events add karne ke liye).
- `.env` kabhi git pe push mat karna.
