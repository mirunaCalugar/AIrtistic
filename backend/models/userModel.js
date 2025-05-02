import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const res = await pool.query(
    `SELECT 
       id,
       full_name AS "fullName",
       email,
       password_hash   AS "passwordHash",
       avatar_url      AS "avatarUrl",
       bio,
       is_verified     AS "isVerified",
       created_at      AS "createdAt",
       updated_at      AS "updatedAt"
     FROM users
     WHERE email = $1`,
    [email]
  );
  return res.rows[0];
};
export const findUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       id,
       full_name AS "fullName",
       email,
       avatar_url AS "avatarUrl",
       bio,
       is_verified AS "isVerified",
       created_at AS "createdAt",
       updated_at AS "updatedAt"
     FROM users WHERE id = $1`,
    [id]
  );
  return rows[0];
};

export const createUser = async ({
  fullName,
  email,
  passwordHash,
  avatarUrl = null,
  bio = null,
}) => {
  const res = await pool.query(
    `INSERT INTO users
       (full_name, email, password_hash, avatar_url, bio)
     VALUES
       ($1,        $2,    $3,            $4,         $5)
     RETURNING
       id,
       full_name       AS "fullName",
       email,
       avatar_url      AS "avatarUrl",
       bio,
       is_verified     AS "isVerified",
       created_at      AS "createdAt",
       updated_at      AS "updatedAt"`,
    [fullName, email, passwordHash, avatarUrl, bio]
  );
  return res.rows[0];
};
