// src/controllers/artistController.js
import db from "../config/db.js";

export const getRisingAuthors = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { rows } = await db.query(
      `SELECT
             id,
             full_name   AS "name",
             avatar_url  AS "image",
             is_verified AS "isVerified"
           FROM users
            WHERE id <> $1  
           ORDER BY full_name`,
      [currentUserId]
    );
    res.json({ authors: rows });
  } catch (err) {
    console.error("❌ getAllArtists error:", err);
    res.status(500).json({ error: "Failed to fetch artists" });
  }
};
