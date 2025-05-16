import db from "../config/db.js";
import {
  updatePost,
  deletePost,
  findOrCreateTag,
  linkPostTag,
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
