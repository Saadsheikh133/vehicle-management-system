import express from "express";
import { userControllers } from "./user.controllers";


const router = express.Router();

router.post("/", userControllers.createUser);

export const userRoutes = router;