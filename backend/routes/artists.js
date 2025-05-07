import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getRisingAuthors } from "../controllers/artistController.js";
import { getArtistById } from "../controllers/artists.js";

const router = express.Router();

router.get("/", requireAuth, getRisingAuthors);
router.get("/:id", getArtistById);
//router.get("/", requireAuth, getAllArtists);

export default router;
