import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";


const router = Router();


router.post("/", vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getAllVehicles);

router.get("/:id", vehicleControllers.getSingleVehicle)

router.put("/:id", vehicleControllers.updateVehicle)


export const vehicleRoutes = router;