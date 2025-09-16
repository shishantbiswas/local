import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
  type Systeminformation,
  cpu,
  mem,
  networkStats,
  osInfo,
} from "systeminformation";

interface Data {
  cpu: Systeminformation.CpuData;
  mem: Systeminformation.MemData;
  network: Systeminformation.NetworkStatsData;
  os: Systeminformation.OsData;
}

const app = new Hono();

app.use(
  cors({
    origin: "*",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
  }),
  logger()
);
app.get("/api", async (c) => {
  return c.json({
    cpu: await cpu(),
    mem: await mem(),
    network: await networkStats(),
    os: await osInfo(),
  });
});

export default {
  port: 9872,
  fetch: app.fetch,
};
