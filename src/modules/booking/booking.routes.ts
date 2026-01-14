import { Router } from "express";
import { bookingControllers } from "./booking.controllers";
import auth from "../auth/auth";


const router = Router();

router.post("/", auth(), bookingControllers.createBooking);

router.get("/", auth(), bookingControllers.getAllBookings);

export const bookingRoutes = router;