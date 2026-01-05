import { Request, Response } from "express";
import { userServices } from "./user.services";


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
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
    const result = await userServices.updateUser(
      req.body,
      req.params.userId!
    );
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
}

export const userControllers = {
  getAllUsers,
  updateUser,
};