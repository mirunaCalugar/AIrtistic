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

    // 2️⃣ Generăm imagine pe același prompt, la 1024×1024 și returnăm URL
    const imageResponse = await openai.images.generate({
      prompt: message,
      n: 1,
      size: "1024x1024", // rezoluție înaltă pentru detalii artistice
      response_format: "url", // asigură returnarea unui link
    });
    const imageUrl = imageResponse.data[0].url;

    // 3️⃣ Opțional: salvăm în DB (user_id poate fi NULL)
    await pool.query(
      `INSERT INTO generations (user_id, prompt_text, generated_image_url)
         VALUES ($1, $2, $3)`,
      [null, message, imageUrl]
    );

    // 4️⃣ Trimitem răspunsul combinat
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
