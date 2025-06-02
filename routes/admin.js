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
      return res.status(404).json({ desc: "User not found" , status: "false"});
    }

    res.json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch profile", detail: error.message , status: "false"});
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM admin");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Data log failed", status: "false" });
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
    res.status(200).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ desc: "Registration failed" , status: "false" });
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
    res.status(200).json({ desc: "User registered" , status: "true" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ desc: "Registration failed" , status: "false"});
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
      return res.status(400).json({ desc: "Invalid credentials" , status: "false"});
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ desc: "Invalid credentials" , status: "false"});
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ desc: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ desc: "Login failed" , status: "false"});
  }
});

module.exports = router;
