import { Router } from "express";
import { getRooms, updateRoomStatus } from "../controllers/roomController.js";

const router = Router();

router.get("/", getRooms);
router.patch("/:number/status", updateRoomStatus);

export default router;
