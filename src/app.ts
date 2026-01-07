import  express, { Request, Response }  from "express"
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";


const app = express();

// parser
app.use(express.json())

// database connection
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/vehicles", vehicleRoutes);

app.use("/api/v1/bookings", bookingRoutes);

export default app;