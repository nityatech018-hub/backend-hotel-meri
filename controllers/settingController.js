import { pool } from "../config/db.js";

export const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM settings WHERE id = 1");
    if (rows.length === 0) return res.status(404).json({ error: "Settings not found." });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch settings." });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const s = req.body;
    await pool.query(
      `UPDATE settings SET 
        hotel_name = COALESCE(?, hotel_name),
        address = COALESCE(?, address),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        whatsapp = COALESCE(?, whatsapp),
        tax_rate = COALESCE(?, tax_rate)
      WHERE id = 1`,
      [s.hotelName, s.address, s.phone, s.email, s.whatsapp, s.taxRate]
    );
    res.json({ message: "Settings updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update settings." });
  }
};
