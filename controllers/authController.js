import { pool } from "../config/db.js";

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const [rows] = await pool.query(
      "SELECT id, email, password, name, phone, city, role FROM users WHERE LOWER(email) = LOWER(?)",
      [email.trim()]
    );

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }

    const user = rows[0];
    if (role && user.role !== role) {
      return res.status(403).json({
        error: role === "reception" ? "This account is not a reception account." : "Please use Reception login for staff.",
      });
    }

    res.json({
      session: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Login failed." });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name, phone, city } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", [email.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    await pool.query(
      "INSERT INTO users (email, password, name, phone, city, role) VALUES (?, ?, ?, ?, ?, 'guest')",
      [email.trim().toLowerCase(), password, name.trim(), phone || "", city || null]
    );

    res.status(201).json({
      session: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: "guest",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Registration failed." });
  }
};
