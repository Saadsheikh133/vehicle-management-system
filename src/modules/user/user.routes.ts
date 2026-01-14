import express from "express";
import { userControllers } from "./user.controllers";
import auth from "../auth/auth";


const router = express.Router();

router.get("/",auth(), userControllers.getAllUsers);

router.put("/:userId", auth(), userControllers.updateUser);

router.delete("/:userId",auth(), userControllers.deleteUser);

export const userRoutes = router;