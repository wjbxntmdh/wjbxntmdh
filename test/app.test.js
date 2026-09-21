import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  const app = createApp({ initialNotes: [{ text: "seed note" }] });
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server?.close();
});

test("GET /api/health reports ok", async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("GET /api/notes returns seeded notes", async () => {
  const res = await fetch(`${baseUrl}/api/notes`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.notes.length, 1);
  assert.equal(body.notes[0].text, "seed note");
});

test("POST /api/notes creates a note", async () => {
  const res = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "hello from test" }),
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.note.text, "hello from test");
  assert.ok(body.note.id);

  const listRes = await fetch(`${baseUrl}/api/notes`);
  const listBody = await listRes.json();
  assert.equal(listBody.notes[0].text, "hello from test");
});

test("POST /api/notes rejects empty text", async () => {
  const res = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "   " }),
  });
  assert.equal(res.status, 400);
});

test("DELETE /api/notes/:id removes a note", async () => {
  const created = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "to be deleted" }),
  }).then((r) => r.json());

  const del = await fetch(`${baseUrl}/api/notes/${created.note.id}`, {
    method: "DELETE",
  });
  assert.equal(del.status, 200);

  const missing = await fetch(`${baseUrl}/api/notes/${created.note.id}`, {
    method: "DELETE",
  });
  assert.equal(missing.status, 404);
});
