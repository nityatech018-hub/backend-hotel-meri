import { pool } from "../config/db.js";

export const getRooms = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms ORDER BY floor ASC, room_number ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch rooms." });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { number } = req.params;
    const { status } = req.body;

    await pool.query("UPDATE rooms SET status = ? WHERE room_number = ?", [status, number]);
    res.json({ message: "Room status updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update room status." });
  }
};
