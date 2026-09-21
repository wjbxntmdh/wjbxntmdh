# wjbxntmdh — Notes

A small, modern notes web app: an Express JSON API with a static, responsive
frontend. Notes are stored in memory (no database required), which keeps the
project easy to run and demonstrate end to end.

## Requirements

- Node.js >= 20 (developed on Node 22)
- npm

## Getting started

```bash
npm install
npm start
```

Then open http://localhost:3000.

Use `npm run dev` for auto-reload during development.

## Testing

```bash
npm test
```

Runs the integration tests (Node's built-in test runner) against the Express
app on an ephemeral port.

## API

| Method | Path             | Description                     |
| ------ | ---------------- | ------------------------------- |
| GET    | `/api/health`    | Health check                    |
| GET    | `/api/notes`     | List notes                      |
| POST   | `/api/notes`     | Create a note (`{ "text": … }`) |
| DELETE | `/api/notes/:id` | Delete a note by id             |

## Project layout

```
public/        Static frontend (HTML/CSS/JS)
src/app.js     Express app factory (routes + in-memory store)
src/server.js  Server entrypoint
test/          Integration tests
```

## Configuration

- `PORT` — server port (default `3000`)
- `HOST` — bind address (default `0.0.0.0`)
