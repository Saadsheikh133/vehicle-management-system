import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";

const router = Router();

router.post("/", vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getAllVehicles);

router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

router.put("/:vehicleId", vehicleControllers.updateVehicle);

router.delete("/:vehicleId", vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
