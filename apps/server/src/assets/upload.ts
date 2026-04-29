import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";

const uploadRoot = path.resolve(process.cwd(), "uploads");
const assetTypes = new Set(["teams", "players"]);

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const type = req.params.type === "players" ? "players" : "teams";
    const dir = path.join(uploadRoot, type);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, _file, cb) => {
    cb(null, `${param(req.params.id)}.png`);
  }
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  }
});

export const assetsRouter = Router();

assetsRouter.post("/assets/:type/:id", upload.single("file"), (req, res) => {
  const type = param(req.params.type);
  const id = param(req.params.id);

  if (!assetTypes.has(type)) {
    res.status(400).json({ error: "Invalid asset type" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "Missing image file field named 'file'" });
    return;
  }

  res.status(201).json({
    id,
    type,
    url: `/assets/${type}/${id}`
  });
});

assetsRouter.get("/assets/:type/:id", (req, res) => {
  const type = param(req.params.type);
  const id = param(req.params.id);

  if (!assetTypes.has(type)) {
    res.status(400).json({ error: "Invalid asset type" });
    return;
  }

  const filePath = path.join(uploadRoot, type, `${id}.png`);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  res.sendFile(filePath);
});
