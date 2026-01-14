import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface User {
      id: number;
      role: "admin" | "customer";
    }
    interface Request {
      user: JwtPayload;
      user?: User;
    }
  }
}

export {};
