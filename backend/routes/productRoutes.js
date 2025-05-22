import express from "express";
import {
  getProducts,
  getProductById,
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/").get(getProducts); // use controller
router.route("/:id").get(getProductById);

export default router;
