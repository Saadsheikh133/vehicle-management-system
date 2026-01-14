import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";
import auth from "../auth/auth";

const router = Router();

router.post("/",auth(), vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getAllVehicles);

router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

router.put("/:vehicleId",auth(), vehicleControllers.updateVehicle);

router.delete("/:vehicleId", auth(), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
