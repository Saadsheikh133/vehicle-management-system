import express from "express";
import { userControllers } from "./user.controllers";


const router = express.Router();

router.get("/", userControllers.getAllUsers);

router.put("/:userId", userControllers.updateUser);

export const userRoutes = router;