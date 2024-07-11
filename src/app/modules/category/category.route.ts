import express from "express";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.get("/", CategoryController.getAllCategory);
router.get("/:id", CategoryController.getSingleCategory);
router.post("/create", CategoryController.createCategory);
router.patch("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deletCategory);

export const CategoryRoutes = router;
