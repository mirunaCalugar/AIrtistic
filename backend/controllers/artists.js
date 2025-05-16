// src/controllers/artists.js
import { findUserById } from "../models/userModel.js";
import { getPostsByUser } from "../models/postModel.js";

export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await findUserById(id);
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    const posts = await getPostsByUser(id);

    res.json({ artist, posts });
  } catch (err) {
    console.error("Error fetching artist profile:", err);
    res.status(500).json({ error: "Could not fetch artist profile" });
  }
};
