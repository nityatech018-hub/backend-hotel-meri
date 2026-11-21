import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  checkIn,
  checkOut,
  recordPayment,
} from "../controllers/bookingController.js";

const router = Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.post("/:id/check-in", checkIn);
router.post("/:id/check-out", checkOut);
router.post("/:id/payment", recordPayment);

export default router;
