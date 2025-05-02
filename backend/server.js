import "dotenv/config";
import cors from "cors";
import express from "express";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1) body parser + logger + CORS
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2) SERVE STATIC AVATARS
//   acum orice request către /uploads/avatars/<nume> va returna fișierul din disk
//   asigură‐te că există folderul uploads/avatars în root
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "uploads/avatars"))
);

// (opțional) dacă vrei să expui tot uploads/
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3) rutele tale de autentificare (+ upload avatar)
app.use("/auth", authRoutes);

// 4) sanity check
app.get("/", (req, res) => {
  res.send("🎨 Airtistic Backend is up and running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
