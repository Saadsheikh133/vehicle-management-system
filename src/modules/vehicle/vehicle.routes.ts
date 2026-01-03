import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";


const router = Router();


router.post("/", vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getAllVehicles);


export const vehicleRoutes = router;