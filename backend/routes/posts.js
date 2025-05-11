// src/routes/posts.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createPost,
  findOrCreateTag,
  linkPostTag,
  getPostsByUser,
} from "../models/postModel.js";

const router = express.Router();

// Create a new post
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { imageUrl, description, tags } = req.body;

    // 1️⃣ Create the post
    const post = await createPost(userId, imageUrl, description);

    // 2️⃣ Upsert and link tags
    for (const name of tags) {
      const { id: tagId } = await findOrCreateTag(name.trim().toLowerCase());
      await linkPostTag(post.id, tagId);
    }

    // 3️⃣ Respond with created post and tags
    return res.json({ post, tags });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not create post" });
  }
});

// Get all posts for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await getPostsByUser(userId);
    return res.json({ posts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not fetch posts" });
  }
});

export default router;
