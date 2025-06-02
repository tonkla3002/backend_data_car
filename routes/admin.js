// routes/admin.js
require("dotenv").config(); // โหลด .env ก่อนเสมอ

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../pool");
const authenticateToken = require("../middleware/auth");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
// GET profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query("SELECT username FROM admin ");

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Profile Error:", error); // สำคัญ
    res
      .status(500)
      .json({ error: "Failed to fetch profile", detail: error.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM admin");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Data log failed" });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO admin (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.put("/changePassword", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `UPDATE public.admin
      SET password=$2
      WHERE username = $1;`,
      [username, hashedPassword]
    );
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM admin WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
