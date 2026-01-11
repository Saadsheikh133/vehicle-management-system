import { Request, Response } from "express";
import { userServices } from "./user.services";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    if (req.user.role !== "admin") {
      return res.status(500).json({
        success: false,
        message: "You are not admin!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users Retrieved Successfully.",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.updateUser(req.body, req.params.userId!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User Updated Successfully.",
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Users Not Found!!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users Deleted Successfully.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};
