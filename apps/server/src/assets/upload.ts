import fs from "node:fs";
import path from "node:path";
import type { RequestHandler } from "express";
import { Router } from "express";
import multer from "multer";

const uploadRoot = path.resolve(process.cwd(), "uploads");
const assetTypes = new Set(["teams", "players"]);
const safeIdPattern = /^[a-zA-Z0-9_-]+$/;
const maxUploadBytes = 2 * 1024 * 1024;

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function isAssetType(value: string): value is "teams" | "players" {
  return assetTypes.has(value);
}

function assetPath(type: "teams" | "players", id: string): string {
  const dir = path.join(uploadRoot, type);
  const filePath = path.resolve(dir, `${id}.png`);

  if (!filePath.startsWith(`${path.resolve(dir)}${path.sep}`)) {
    throw new Error("Invalid asset path");
  }

  return filePath;
}

const validateAssetParams: RequestHandler = (req, res, next) => {
  const type = param(req.params.type);
  const id = param(req.params.id);

  if (!isAssetType(type)) {
    res.status(400).json({ error: "Invalid asset type" });
    return;
  }

  if (!safeIdPattern.test(id)) {
    res.status(400).json({ error: "Invalid asset id. Use only letters, numbers, underscores, and hyphens." });
    return;
  }

  next();
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const type = param(req.params.type) as "teams" | "players";
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
  limits: {
    fileSize: maxUploadBytes
  },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/webp");
  }
});

const uploadAsset: RequestHandler = (req, res, next) => {
  upload.single("file")(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: `Image must be ${maxUploadBytes / 1024 / 1024} MB or smaller` });
      return;
    }

    next(error);
  });
};

export const assetsRouter = Router();

assetsRouter.post("/assets/:type/:id", validateAssetParams, uploadAsset, (req, res) => {
  const type = param(req.params.type) as "teams" | "players";
  const id = param(req.params.id);

  if (!req.file) {
    res.status(400).json({ error: "Missing image file field named 'file' or unsupported image type" });
    return;
  }

  res.status(201).json({
    id,
    type,
    url: `/assets/${type}/${encodeURIComponent(id)}`
  });
});

assetsRouter.get("/assets/:type/:id", validateAssetParams, (req, res) => {
  const type = param(req.params.type) as "teams" | "players";
  const id = param(req.params.id);

  const filePath = assetPath(type, id);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  res.set("Cache-Control", "no-store, max-age=0");
  res.sendFile(filePath);
});
