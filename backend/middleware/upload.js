// src/middleware/upload.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/avatars"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  },
});
export const uploadAvatar = multer({
  storage,
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Only images"), false),
  limits: { fileSize: 2 * 1024 * 1024 },
});

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/posts"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `post-${req.user.id}-${Date.now()}${ext}`);
  },
});
export const uploadPost = multer({
  storage: postStorage,
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Only images"), false),
  limits: { fileSize: 5 * 1024 * 1024 }, // de exemplu 5MB
});
