import express from "express";
import { OrderProductController } from "./orderProduct.controller";

const router = express.Router();

router.get("/", OrderProductController.getAllOrderProduct);
router.get("/:id", OrderProductController.getSingleOrderProduct);
router.post("/create", OrderProductController.createOrderProduct);
router.patch("/:id", OrderProductController.updateOrderProduct);
router.delete("/:id", OrderProductController.deleteOrderProduct);

export const OrderProductRoutes = router;
