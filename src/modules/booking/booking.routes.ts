import { Router } from "express";
import { bookingControllers } from "./booking.controllers";


const router = Router();

router.post("/", bookingControllers.createBooking);

export const bookingRoutes = router;