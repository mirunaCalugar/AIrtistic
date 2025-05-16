// // src/routes/posts.js
// import express from "express";
// import { requireAuth } from "../middleware/auth.js";
// import { uploadPost } from "../middleware/upload.js";
// import {
//   createPost,
//   findOrCreateTag,
//   linkPostTag,
//   getPostsByUser,
// } from "../models/postModel.js";

// const router = express.Router();

// // Create a new post with image upload (saved in avatars folder)
// router.post("/", requireAuth, uploadPost.single("image"), async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const description = req.body.description;
//     // Parse tags: expect JSON string or array
//     let tags = [];
//     if (req.body.tags) {
//       tags = Array.isArray(req.body.tags)
//         ? req.body.tags
//         : JSON.parse(req.body.tags);
//     }
//     // Build image URL relative to avatars uploads
//     const imageUrl = req.file
//       ? `/uploads/posts/${req.file.filename}`
//       : req.body.imageUrl;

//     // 1️⃣ Create the post record
//     const post = await createPost(userId, imageUrl, description);

//     // 2️⃣ Upsert and link tags
//     for (const name of tags) {
//       const { id: tagId } = await findOrCreateTag(name.trim().toLowerCase());
//       await linkPostTag(post.id, tagId);
//     }

//     // 3️⃣ Respond with created post and tags
//     return res.json({ post, tags });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Could not create post" });
//   }
// });

// // Get all posts for the authenticated user
// router.get("/", requireAuth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const posts = await getPostsByUser(userId);
//     return res.json({ posts });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Could not fetch posts" });
//   }
// });
// router.get("/all", requireAuth, async (req, res) => {
//   try {
//     const posts = await getAllPosts();
//     return res.json({ posts });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Could not fetch all posts" });
//   }
// });

// export default router;
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { uploadPost } from "../middleware/upload.js";
import {
  createPost,
  findOrCreateTag,
  linkPostTag,
  getAllPosts,
  updatePost,
  deletePost,
} from "../models/postModel.js";
import {
  editPost,
  removePost,
  unlikePost,
} from "../controllers/postController.js";
import {
  likePost,
  getPosts,
  getPostsByUserId,
} from "../controllers/postController.js";

const router = express.Router();

// Create a new post with image upload
router.post("/", requireAuth, uploadPost.single("image"), async (req, res) => {
  try {
    const userId = req.user.id;
    const description = req.body.description;
    let tags = [];
    if (req.body.tags) {
      tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : JSON.parse(req.body.tags);
    }
    const imageUrl = req.file
      ? `/uploads/posts/${req.file.filename}`
      : req.body.imageUrl;

    const post = await createPost(userId, imageUrl, description);
    for (const name of tags) {
      const { id: tagId } = await findOrCreateTag(name.trim().toLowerCase());
      await linkPostTag(post.id, tagId);
    }

    return res.json({ post, tags });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not create post" });
  }
});

// Get all posts for the authenticated user
// router.get("/", requireAuth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const posts = await getPostsByUser(userId);
//     return res.json({ posts });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Could not fetch posts" });
//   }
// });

// Get all posts from all users (Artists' choice)
router.get("/all", requireAuth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const posts = await getAllPosts();
    // Exclude posts by the current user
    const otherPosts = posts.filter(
      (p) => String(p.user_id) !== String(currentUserId)
    );
    return res.json({ posts: otherPosts });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Could not fetch posts from other users" });
  }
});
router.get("/user/:id", requireAuth, getPostsByUserId);
// UPDATE
router.put(
  "/:id",
  requireAuth,
  express.json(),
  async (req, res) => await editPost(req, res)
);
// DELETE
router.delete(
  "/:id",
  requireAuth,
  async (req, res) => await removePost(req, res)
);

// router.post(
//   "/:id/like",
//   requireAuth,
//   async (req, res) => await likePost(req, res)
// );
router.get("/", requireAuth, getPosts);
router.post("/:id/like", requireAuth, likePost);
router.delete("/:id/like", requireAuth, unlikePost);

export default router;
