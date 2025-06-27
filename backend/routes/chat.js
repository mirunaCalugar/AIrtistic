// routes/chat.js
import express from "express";
import OpenAI from "openai";
import pool from "../config/db.js";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // 1️⃣ Generăm răspunsul text
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "Ești un asistent prietenos care poate genera atât text, cât și imagini artistice. Te rog să răspunzi la întrebările utilizatorului și să creezi o imagine pe baza promptului dat.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });
    const reply = chatCompletion.choices[0].message.content;

    const imageResponse = await openai.images.generate({
      prompt: message,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });
    const imageUrl = imageResponse.data[0].url;

    await pool.query(
      `INSERT INTO generations (user_id, prompt_text, generated_image_url)
         VALUES ($1, $2, $3)`,
      [null, message, imageUrl]
    );

    res.json({ reply, imageUrl });
  } catch (err) {
    console.error("🛑 Error în /api/chat:", err);
    if (err.status === 429 || err.code === "insufficient_quota") {
      return res.status(429).json({
        error: "Cota OpenAI a fost epuizată. Te rog să verifici planul.",
      });
    }
    res.status(500).json({ error: "Eroare internă la server." });
  }
});

export default router;
