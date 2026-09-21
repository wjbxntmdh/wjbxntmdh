import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Build the Express application. The notes store is kept in memory and can be
 * seeded by tests, so the factory takes an optional initial list of notes.
 */
export function createApp({ initialNotes = [] } = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.static(join(__dirname, "..", "public")));

  /** @type {{ id: string, text: string, createdAt: string }[]} */
  const notes = initialNotes.map((note) => ({
    id: note.id ?? randomUUID(),
    text: String(note.text ?? "").trim(),
    createdAt: note.createdAt ?? new Date().toISOString(),
  }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/api/notes", (_req, res) => {
    res.json({ notes });
  });

  app.post("/api/notes", (req, res) => {
    const text = String(req.body?.text ?? "").trim();
    if (!text) {
      return res.status(400).json({ error: "Note text is required." });
    }
    const note = { id: randomUUID(), text, createdAt: new Date().toISOString() };
    notes.unshift(note);
    res.status(201).json({ note });
  });

  app.delete("/api/notes/:id", (req, res) => {
    const index = notes.findIndex((note) => note.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Note not found." });
    }
    const [removed] = notes.splice(index, 1);
    res.json({ note: removed });
  });

  return app;
}
