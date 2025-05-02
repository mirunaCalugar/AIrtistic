import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../server.js";
import pool from "../config/db.js";

beforeAll(async () => {
  await pool.query("DELETE FROM users");
  const hashed = await bcrypt.hash("UserPassword123!", 10);
  await pool.query(
    "INSERT INTO users(full_name, email, password_hash) VALUES($1,$2,$3)",
    ["Test User", "existing@example.com", hashed]
  );
});

afterAll(async () => {
  await pool.end();
});

describe("POST /auth/login", () => {
  it("should succeed with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "existing@example.com", password: "UserPassword123!" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("existing@example.com");
  });

  it("should reject invalid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "existing@example.com", password: "wrong" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials.");
  });

  it("should reject missing fields", async () => {
    const res = await request(app).post("/auth/login").send({ email: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email and password are required.");
  });
});
