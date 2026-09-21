const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const addButton = document.getElementById("add-button");
const list = document.getElementById("notes-list");
const emptyState = document.getElementById("empty-state");
const statusBadge = document.getElementById("status-badge");
const statusText = document.getElementById("status-text");

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function render(notes) {
  list.innerHTML = "";
  emptyState.hidden = notes.length > 0;

  for (const note of notes) {
    const el = document.createElement("article");
    el.className = "note";
    el.dataset.id = note.id;

    const body = document.createElement("div");
    body.className = "body";

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = note.text;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = formatTime(note.createdAt);

    body.append(text, meta);

    const del = document.createElement("button");
    del.className = "delete";
    del.type = "button";
    del.setAttribute("aria-label", "Delete note");
    del.textContent = "✕";
    del.addEventListener("click", () => deleteNote(note.id));

    el.append(body, del);
    list.append(el);
  }
}

function setStatus(online) {
  statusBadge.classList.toggle("online", online);
  statusBadge.classList.toggle("offline", !online);
  statusText.textContent = online ? "API online" : "API offline";
}

async function loadNotes() {
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    setStatus(true);
    render(data.notes);
  } catch {
    setStatus(false);
  }
}

async function addNote(text) {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("failed to add note");
  await loadNotes();
}

async function deleteNote(id) {
  const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
  if (res.ok) await loadNotes();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addButton.disabled = true;
  try {
    await addNote(text);
    input.value = "";
    input.focus();
  } finally {
    addButton.disabled = false;
  }
});

loadNotes();
