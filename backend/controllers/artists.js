import db from "../config/db.js";
import { findUserById } from "../models/userModel.js";

export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await findUserById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    // opțional: adaugă aici posts, tags, etc, dacă vrei
    res.json({ artist });
  } catch (err) {
    console.error("Error fetching artist by id:", err);
    res.status(500).json({ message: "Server error" });
  }
};
