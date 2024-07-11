import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getSingleUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

router.post("/create", UserController.createUser);

export const UserRoutes = router;
