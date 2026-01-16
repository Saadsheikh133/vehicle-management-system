import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import config from "../../config";
import jwt from "jsonwebtoken";

interface UserPayload {
  name: string,
  email: string,
  password: string,
  phone: number,
  role: string
}

const createUser = async (payload: UserPayload) => {
  const { name, email, password, phone, role } = payload;
  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3 , $4, $5) RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPass, phone, role]
  );
  return result;
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    }
  );
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

export const authServices = {
  createUser,
  loginUser
}
