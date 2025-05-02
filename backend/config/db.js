// config/db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "AIrtisticDB",
  // ssl: { rejectUnauthorized: false } // dacă ai nevoie de SSL în producție
});

export default pool;
