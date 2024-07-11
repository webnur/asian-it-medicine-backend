import express from "express";
import { OrderController } from "./order.controller";

const router = express.Router();

router.get("/", OrderController.getAllOrder);
router.get("/:id", OrderController.getSingleOrder);
router.post("/create", OrderController.createOrder);
router.patch("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

export const OrderRoutes = router;
