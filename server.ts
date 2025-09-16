import { Hono } from "hono";

const app = new Hono();
app.get("/api", (c) => c.json({ message: "Hello Bun!" }));

export default {
  port: 3000,
  fetch: app.fetch,
};
