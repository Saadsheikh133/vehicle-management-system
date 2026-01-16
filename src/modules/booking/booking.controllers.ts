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
        vehicle: result.vehicle,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const result = await bookingServices.getAllBookings(userId, role);

    res.status(200).json({
      success: true,
      message:
        role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;
    const loggedInUser = req.user!;

    if (!["cancelled", "returned"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    // customer rules
    if (loggedInUser.role === "customer") {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Customers can only cancel bookings,",
        });
      }

      // check ownership
      const bookingCheck = await bookingServices.getBookingById(bookingId);

      if (bookingCheck.customer_id !== loggedInUser.id) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update this booking",
        });
      }

      if (bookingCheck.status !== "active") {
        return res.status(400).json({
          success: false,
          message: "Only active bookings can be cancelled",
        });
      }
    }

    // admin rules
    if (loggedInUser.role === "admin" && status !== "returned") {
      return res.status(403).json({
        success: false,
        message: "Admin can only mark bookings as returned",
      });
    }

    const result = await bookingServices.updateBookingStatus(bookingId, status);

    // response handling
    if (status === "cancelled") {
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result.booking,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...result.booking,
        vehicle: result.vehicle,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBooking,
};
