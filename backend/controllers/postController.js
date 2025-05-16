export const createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, description, tags } = req.body;
  // multer a salvat fișierul în uploads/posts și a pus numele în req.file.filename
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
