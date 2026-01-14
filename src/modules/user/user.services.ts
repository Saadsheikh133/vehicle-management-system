import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result;
};

const updateUser = async (payload: Record<string, unknown>, userId: number) => {
  const { name, email, phone, role } = payload;
  const fields = [];
  const values = [];
  let index = 1;

  if (name) {
    fields.push(`name = $${index++}`);
    values.push(name);
  }

  if (email) {
    fields.push(`email = $${index++}`);
    values.push(email);
  }

  if (phone) {
    fields.push(`phone = $${index++}`);
    values.push(phone);
  }

  if (role) {
    fields.push(`role = $${index++}`);
    values.push(role);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  const result = await pool.query(
    `UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, name, email, phone, role;
      `,
    [...values, userId]
  );
  return result;
};

const deleteUser = async (userId: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  return result;
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
