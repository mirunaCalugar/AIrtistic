// src/controllers/authController.js
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// 1) Sign Up
export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // verifică dacă email-ul există deja
    const { rows: existing } = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // hash la parolă
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // inserează user-ul fără coloana role (se folosește default din DB)
    const { rows } = await db.query(
      `INSERT INTO users
         (full_name, email, password_hash)
       VALUES
         ($1, $2, $3)
       RETURNING id`,
      [fullName, email, hash]
    );
    const userId = rows[0].id;

    // generează token
    const token = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};

// 2) Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // preia user-ul
    const { rows } = await db.query(
      "SELECT id, password_hash FROM users WHERE email = $1",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    // compară parola
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generează token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

// // 3) Get Profile
// export const getProfile = (req, res) => {
//   res.json({ user: req.user });
// };

// // 4) Update Profile / Upload Avatar
// export const updateProfile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // șterge vechea poză (opțional)
//     if (req.user.avatarUrl) {
//       fs.unlink(path.join(process.cwd(), req.user.avatarUrl), () => {});
//     }

//     const newAvatarUrl = `/uploads/avatars/${req.file.filename}`;

//     await db.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
//       newAvatarUrl,
//       req.user.id,
//     ]);

//     res.json({ avatarUrl: newAvatarUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// };
