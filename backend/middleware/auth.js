// src/middleware/auth.js
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export async function requireAuth(req, res, next) {
  // Allow preflight
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❗️ Authorization header missing or malformed:", authHeader);
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.slice(7); // remove "Bearer "
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ JWT payload:", payload);
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  try {
    console.log("🔄 Querying user with ID:", payload.id);
    const { rows } = await db.query(
      `SELECT
         id,
         full_name   AS "fullName",
         email,
         avatar_url  AS "avatarUrl"
       FROM users
       WHERE id = $1`,
      [payload.id]
    );
    console.log("🗄️  Query result:", rows);

    if (!rows[0]) {
      console.error("❗️ No user found for ID:", payload.id);
      return res.status(401).json({ error: "User not found" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.error("Database error in requireAuth:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
