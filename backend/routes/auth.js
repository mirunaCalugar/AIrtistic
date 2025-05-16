import express from "express";
import { signUp, login } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadAvatar } from "../middleware/upload.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

// Public
router.post("/signup", signUp);
router.post("/login", login);

// Protected: fetch profile
router.get("/profile", requireAuth, getProfile);
router.post(
  "/profile/avatar",
  requireAuth,
  uploadAvatar.single("avatar"),
  updateProfile
);

router.post(
  "/profile/avatar",
  requireAuth,
  uploadAvatar.single("avatar"),
  updateProfile
);
export default router;
