import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const fields = [];
  const values = [];
  let index = 1;

   if (vehicle_name) {
     fields.push(`vehicle_name = $${index++}`);
     values.push(vehicle_name);
  };

    if (type) {
      fields.push(`type = $${index++}`);
      values.push(type);
  };

  if (registration_number) {
    fields.push(`registration_number = $${index++}`);
    values.push(registration_number);
  };

  if (daily_rent_price !== undefined) {
    fields.push(`daily_rent_price = $${index++}`);
    values.push(daily_rent_price);
  };

  if (availability_status) {
    fields.push(`availability_status = $${index++}`);
    values.push(availability_status);
  };

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  const result = await pool.query(
    `
      UPDATE vehicles
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *;
      `,
    [...values, id]
  );
  return result;
};

const deleteVehicle = async (id: string) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  return result;
};


export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
