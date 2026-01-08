const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store (good for sample)
let todos = [
  { id: 1, title: "First todo", done: false }
];

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/todos", (req, res) => res.json(todos));

app.post("/api/todos", (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });

  const next = { id: Date.now(), title, done: false };
  todos.unshift(next);
  res.status(201).json(next);
});

app.patch("/api/todos/:id/toggle", (req, res) => {
  const id = Number(req.params.id);
  const t = todos.find(x => x.id === id);
  if (!t) return res.status(404).json({ error: "not found" });
  t.done = !t.done;
  res.json(t);
});

module.exports = { app };
