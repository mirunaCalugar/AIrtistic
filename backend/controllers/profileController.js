import fs from "fs";
import path from "path";
import db from "../config/db.js";

export const getProfile = (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (req.user.avatarUrl) {
      fs.unlink(path.join(process.cwd(), req.user.avatarUrl), () => {});
    }
    const newAvatarUrl = `/uploads/avatars/${req.file.filename}`;
    await db.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      newAvatarUrl,
      req.user.id,
    ]);
    res.json({ avatarUrl: newAvatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};
