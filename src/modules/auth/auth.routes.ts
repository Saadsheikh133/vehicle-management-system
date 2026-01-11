import express from "express";
import { authControllers } from "./auth.controllers";

const router = express.Router();

router.post("/signup", authControllers.createUser);

router.post("/signin", authControllers.loginUser);

export const authRoutes = router;