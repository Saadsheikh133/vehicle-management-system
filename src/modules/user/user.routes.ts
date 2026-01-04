import express from "express";
import { userControllers } from "./user.controllers";


const router = express.Router();

router.post("/auth/signup", userControllers.createUser);

router.get("/users", userControllers.getAllUsers);

export const userRoutes = router;