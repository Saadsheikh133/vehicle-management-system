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
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles`
  );
  return result;
};

const getSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [vehicleId]
  );
  return result;
};

const updateVehicle = async (
  payload: Record<string, unknown>,
  vehicleId: string
) => {
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
  }

  if (type) {
    fields.push(`type = $${index++}`);
    values.push(type);
  }

  if (registration_number) {
    fields.push(`registration_number = $${index++}`);
    values.push(registration_number);
  }

  if (daily_rent_price !== undefined) {
    fields.push(`daily_rent_price = $${index++}`);
    values.push(daily_rent_price);
  }

  if (availability_status) {
    fields.push(`availability_status = $${index++}`);
    values.push(availability_status);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  const result = await pool.query(
    `
      UPDATE vehicles
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status;
      `,
    [...values, vehicleId]
  );
  return result;
};

const deleteVehicle = async (vehicleId: string) => {
  const activeBookings = await pool.query(
    `
    SELECT 1 FROM bookings
    WHERE vehicle_id = $1 AND status = 'active'
    `,
    [vehicleId]
  );

  if (activeBookings.rowCount ?? 0 > 0) {
    throw new Error("Vehicle has active bookings and cannot be deleted");
  }
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);
  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
