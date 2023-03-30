import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  createOrderStripe
} from "../controllers/ordersController.js";
import auth from '../middleware/auth.js'
const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.post("/stripe", createOrderStripe);

router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
