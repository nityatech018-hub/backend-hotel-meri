import { Router } from "express";
import { getCategories, updateCategoryPrice } from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategories);
router.patch("/:id/price", updateCategoryPrice);

export default router;
