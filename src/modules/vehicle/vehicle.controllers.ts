import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const createVehicle = async (req: Request, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not admin!!",
      });
    }
    const result = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicle(
      req.params.vehicleId as string
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle Not Found!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle Fetched Successfully.",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not admin!!",
      });
    }
    const result = await vehicleServices.updateVehicle(
      req.body,
      req.params.vehicleId!
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle Not Found!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle Updated Successfully.",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not admin!!",
      });
    }
    const result = await vehicleServices.deleteVehicle(
      req.params.vehicleId as string
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle Not Found!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle Deleted Successfully.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
