import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts); // use controller
router.route("/:id").get(getProductById);
router.route("/").post(protect, admin, createProduct);
router.route("/:id").put(protect, admin, updateProduct);

export default router;
