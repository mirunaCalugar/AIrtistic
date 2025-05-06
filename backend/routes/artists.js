import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getRisingAuthors } from "../controllers/artistController.js";

const router = express.Router();

router.get("/", requireAuth, getRisingAuthors);
//router.get("/", requireAuth, getAllArtists);

export default router;
