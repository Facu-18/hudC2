import http from "node:http";
import cors from "cors";
import express from "express";
import { assetsRouter } from "./assets/upload.js";
import { gsiRouter } from "./gsi/receiver.js";
import { playerNamesRouter } from "./players/names.js";
import { initSocket } from "./socket/socket.js";

const port = Number(process.env.PORT ?? 3000);
const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({ origin: process.env.HUD_ORIGIN ?? "http://localhost:3001" }));
app.use(express.json({ limit: "2mb" }));
app.use(gsiRouter);
app.use(assetsRouter);
app.use(playerNamesRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

server.listen(port, () => {
  console.log(`CS2 HUD server listening on http://localhost:${port}`);
});
