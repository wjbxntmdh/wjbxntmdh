import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

const app = createApp({
  initialNotes: [
    { text: "Welcome! Add a note below to try the app." },
    { text: "This board is served by an Express API." },
  ],
});

app.listen(port, host, () => {
  console.log(`Notes app listening on http://${host}:${port}`);
});
