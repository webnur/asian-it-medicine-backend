import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import { ProductController } from "./prodduct.controller";

const router = express.Router();

router.get("/", ProductController.getAllProduct);
router.get("/:id", ProductController.getSingleProduct);
router.post("/create", ProductController.createProduct);
router.patch("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export const ProductRoutes = router;
