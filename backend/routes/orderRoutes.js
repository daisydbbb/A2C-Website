import express from "express";
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// in express, route order matters
// More specific routes should come before parameterized routes (like /:id)
// /myorders comes before /:id
const router = express.Router();
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
