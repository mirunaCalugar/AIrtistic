import db from "../config/db.js";
import {
  updatePost,
  deletePost,
  findOrCreateTag,
  linkPostTag,
  isPostLikedByUser,
  addLike,
  countLikes,
} from "../models/postModel.js";

export const createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, description, tags } = req.body;

  const imageUrl = `/uploads/posts/${req.file.filename}`;

  // inserare în baza de date
  const result = await pool.query(
    `INSERT INTO posts (user_id, image_url, title, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, imageUrl, title, description]
  );

  res.status(201).json({ post: result.rows[0] });
};
export const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { description, tags } = req.body;
    // 1) update descriere
    const post = await updatePost(postId, description);
    // 2) resetează tag-urile (șterge legăturile vechi)
    await db.query(`DELETE FROM post_tags WHERE post_id = $1`, [postId]);
    // 3) adaugă noile taguri
    for (let name of tags) {
      const { id: tagId } = await findOrCreateTag(name.trim().toLowerCase());
      await linkPostTag(postId, tagId);
    }
    // 4) răspunde cu post+tags
    return res.json({ post, tags });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not update post" });
  }
};

export const removePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await deletePost(postId);
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not delete post" });
  }
};
export const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  if (await isPostLikedByUser(postId, userId)) {
    return res.status(400).json({ error: "Already liked" });
  }
  await addLike(postId, userId);
  const likes = await countLikes(postId);
  return res.json({ likes, liked: true });
};
// src/controllers/postController.js
export const getPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await db.query(
      `
      SELECT
        p.*,
        COALESCE(lc.cnt, 0)     AS likes,
        (ul.user_id IS NOT NULL) AS liked,
        COALESCE(json_agg(
          json_build_object('id', t.id, 'name', t.name)
        ) FILTER (WHERE t.id IS NOT NULL), '[]') AS tags
      FROM posts p
      /* join pentru numărul de like-uri */
      LEFT JOIN (
        SELECT post_id, COUNT(*)::int AS cnt
        FROM likes
        GROUP BY post_id
      ) lc ON lc.post_id = p.id
      /* join pentru a ști dacă user-ul curent a dat like */
      LEFT JOIN likes ul
        ON ul.post_id = p.id AND ul.user_id = $1
      /* join pentru tag-uri */
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id       = pt.tag_id
      WHERE p.user_id = $1     /* doar postările user-ului logat */
      GROUP BY p.id, lc.cnt, ul.user_id
      ORDER BY p.created_at DESC
      `,
      [userId]
    );
    return res.json({ posts: rows });
  } catch (err) {
    console.error("getPosts error:", err);
    return res.status(500).json({ error: "Could not fetch posts" });
  }
};
export const getPostsByUserId = async (req, res) => {
  try {
    const me = req.user.id; // who’s logged in
    const profileId = req.params.id; // whose page we’re viewing

    const { rows } = await db.query(
      `
      SELECT
        p.*,
        COALESCE(lc.cnt, 0) AS likes,
        CASE WHEN ul.user_id IS NOT NULL THEN true ELSE false END AS liked,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM posts p
      LEFT JOIN (
        SELECT post_id, COUNT(*)::int AS cnt
        FROM likes
        GROUP BY post_id
      ) lc ON lc.post_id = p.id
      LEFT JOIN likes ul 
        ON ul.post_id = p.id AND ul.user_id = $1
      LEFT JOIN post_tags pt 
        ON pt.post_id = p.id
      LEFT JOIN tags t 
        ON t.id = pt.tag_id
      WHERE p.user_id = $2
      GROUP BY p.id, lc.cnt, ul.user_id
      ORDER BY p.created_at DESC
      `,
      [me, profileId]
    );

    return res.json({ posts: rows });
  } catch (err) {
    console.error("getPostsByUserId error:", err);
    return res.status(500).json({ error: "Could not fetch user’s posts" });
  }
};
export const unlikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  await db.query(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2`, [
    postId,
    userId,
  ]);
  const likes = await countLikes(postId);
  return res.json({ likes, liked: false });
};
