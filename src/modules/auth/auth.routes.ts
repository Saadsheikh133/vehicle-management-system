import express from "express";
import { authControllers } from "./auth.controllers";

const router = express.Router();

router.post("/signup", authControllers.createUser);

export const authRoutes = router;