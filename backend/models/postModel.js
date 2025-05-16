// src/models/postModel.js
import db from "../config/db.js";

export async function createPost(userId, imageUrl, description) {
  const result = await db.query(
    `INSERT INTO posts (user_id, image_url, description)
     VALUES ($1,$2,$3)
     RETURNING id, user_id, image_url, description, created_at`,
    [userId, imageUrl, description]
  );
  return result.rows[0];
}

export async function findOrCreateTag(name) {
  // în baza de date ai CREATE INDEX pe tags(name), deci upsert e rapid
  const { rows } = await db.query(
    `INSERT INTO tags (name)
       VALUES ($1)
     ON CONFLICT (name) DO NOTHING
     RETURNING id`,
    [name]
  );
  if (rows.length) return rows[0];
  // dacă n-a inserat, înseamnă că exista
  const { rows: existing } = await db.query(
    `SELECT id FROM tags WHERE name = $1`,
    [name]
  );
  return existing[0];
}

export async function linkPostTag(postId, tagId) {
  await db.query(
    `INSERT INTO post_tags (post_id, tag_id)
     VALUES ($1,$2)
     ON CONFLICT DO NOTHING`,
    [postId, tagId]
  );
}
export async function getPostsByUser(userId) {
  const { rows } = await db.query(
    `
    SELECT
      p.*,
      COALESCE(
        json_agg(json_build_object('id', t.id, 'name', t.name))
        FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t       ON t.id = pt.tag_id
    WHERE p.user_id = $1
    GROUP BY p.id
    ORDER BY p.created_at DESC
    `,
    [userId]
  );
  return rows;
}
export async function getAllPosts() {
  const { rows } = await db.query(
    `
    SELECT
      p.id,
      p.user_id,
      p.image_url        AS image,
      p.description,
      p.created_at,
      COALESCE(
        json_agg(json_build_object('id', t.id, 'name', t.name))
        FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON t.id = pt.tag_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
    `
  );
  return rows;
}
export async function updatePost(postId, description) {
  const res = await db.query(
    `UPDATE posts
       SET description = $1
     WHERE id = $2
     RETURNING *`,
    [description, postId]
  );
  return res.rows[0];
}
export async function deletePost(postId) {
  await db.query(`DELETE FROM post_tags WHERE post_id = $1`, [postId]);
  await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);
}
