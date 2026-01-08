import { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const env = import.meta.env.VITE_ENV || "local";
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8080";
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const todosUrl = useMemo(() => `${apiBase}/api/todos`, [apiBase]);

  async function loadTodos() {
    const r = await fetch(todosUrl);
    const data = await r.json();
    setTodos(data);
  }

  async function addTodo(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;

    const r = await fetch(todosUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: t })
    });

    if (!r.ok) return alert("Failed to add todo");
    setTitle("");
    await loadTodos();
  }

  async function toggleTodo(id) {
    const r = await fetch(`${apiBase}/api/todos/${id}/toggle`, { method: "PATCH" });
    if (!r.ok) return alert("Failed to toggle");
    await loadTodos();
  }

  useEffect(() => {
    loadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Fullstack Todo</h1>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10, marginBottom: 16 }}>
        <div><b>env</b> = <code>{env}</code></div>
        <div><b>API</b> = <code>{apiBase}</code></div>
      </div>

      <form onSubmit={addTodo} style={{ display: "flex", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo..."
          style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <button style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd" }}>
          Add
        </button>
      </form>

      <ul style={{ marginTop: 18, paddingLeft: 18 }}>
        {todos.map(t => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <label style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTodo(t.id)}
                style={{ marginRight: 8 }}
              />
              <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
                {t.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
