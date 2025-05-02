// src/middleware/auth.js
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await db.query(
      `SELECT
         id,
         full_name   AS "fullName",
         email,
         role,
         avatar_url  AS "avatarUrl"
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
