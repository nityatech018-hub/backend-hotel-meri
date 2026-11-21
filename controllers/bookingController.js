import { pool } from "../config/db.js";

export const getBookings = async (req, res) => {
  try {
    const { email } = req.query;
    let query = "SELECT * FROM bookings ORDER BY created_at DESC";
    const params = [];

    if (email) {
      query = "SELECT * FROM bookings WHERE LOWER(email) = LOWER(?) ORDER BY created_at DESC";
      params.push(email.trim());
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch bookings." });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bookings WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch booking." });
  }
};

export const createBooking = async (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `HMR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await pool.query(
      `INSERT INTO bookings 
      (id, guest_name, email, phone, category_id, room_number, check_in, check_out, guests, rooms, status, payment, amount_paid, total, source, requests)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        b.guestName,
        b.email,
        b.phone,
        b.categoryId,
        b.roomNumber || null,
        b.checkIn,
        b.checkOut,
        b.guests || 1,
        b.rooms || 1,
        b.status || "Pending",
        b.payment || "Unpaid",
        b.amountPaid || 0,
        b.total,
        b.source || "Website",
        b.requests || null,
      ]
    );

    res.status(201).json({ id, ...b });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create booking." });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomNumber } = req.body;

    await pool.query("UPDATE bookings SET status = 'Checked-In', room_number = ? WHERE id = ?", [roomNumber, id]);
    res.json({ message: "Guest checked in successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Check-in failed." });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT room_number, total FROM bookings WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Booking not found." });

    const booking = rows[0];
    await pool.query("UPDATE bookings SET status = 'Checked-Out', payment = 'Paid', amount_paid = ? WHERE id = ?", [
      booking.total,
      id,
    ]);

    if (booking.room_number) {
      await pool.query("UPDATE rooms SET status = 'cleaning' WHERE room_number = ?", [booking.room_number]);
    }

    res.json({ message: "Guest checked out successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Check-out failed." });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const [rows] = await pool.query("SELECT total, amount_paid FROM bookings WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Booking not found." });

    const b = rows[0];
    const newPaid = Math.min(b.total, Number(b.amount_paid) + Number(amount));
    const newStatus = newPaid >= b.total ? "Paid" : "Partial";

    await pool.query("UPDATE bookings SET amount_paid = ?, payment = ? WHERE id = ?", [newPaid, newStatus, id]);
    res.json({ message: "Payment recorded successfully.", amountPaid: newPaid, payment: newStatus });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to record payment." });
  }
};
