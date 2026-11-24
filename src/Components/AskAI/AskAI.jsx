import { useState, useRef, useEffect } from "react";
import { askAI } from "./api";
import "./ask-ai.css";

export default function AskAI() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // { role: "user" | "ai" | "error", text }
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const q = question.trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const { answer } = await askAI(q);
      setMessages((m) => [...m, { role: "ai", text: answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "error", text: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!open) {
    return (
      <button className="askai-launch" onClick={() => setOpen(true)}>
        Ask AI
      </button>
    );
  }

  return (
    <section className="askai-panel" aria-label="Ask AI">
      <header className="askai-head">
        <span>Ask AI</span>
        <button onClick={() => setOpen(false)} aria-label="Close">×</button>
      </header>

      <div className="askai-body">
        {messages.length === 0 && (
          <p className="askai-empty">
            College, timetable, exam ya syllabus ke baare mein kuch bhi poochho.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`askai-msg askai-${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="askai-msg askai-ai">Soch raha hoon…</div>}
        <div ref={endRef} />
      </div>

      <footer className="askai-foot">
        <textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Apna sawal likho"
        />
        <button onClick={handleSend} disabled={loading || !question.trim()}>
          Send
        </button>
      </footer>
    </section>
  );
}