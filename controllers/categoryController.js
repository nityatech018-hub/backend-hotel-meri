import { pool } from "../config/db.js";

export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY price ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch categories." });
  }
};

export const updateCategoryPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    await pool.query("UPDATE categories SET price = ? WHERE id = ?", [price, id]);
    res.json({ message: "Category price updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update category price." });
  }
};
