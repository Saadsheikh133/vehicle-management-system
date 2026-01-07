import { Request, Response } from "express";
import { bookingServices } from "./booking.services";


const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                ...result.booking,
                vehicle: result.vehicle
            }
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

export const bookingControllers = {
    createBooking,
}