import { pool } from "../../config/db";

interface CreateBookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const createBooking = async (payload: CreateBookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (new Date(rent_end_date) <= new Date(rent_start_date)) {
    throw new Error("Rent end date must be after start date");
  }

  const client = await pool.connect();

  try {
    // get vehicle info
    const vehicleInfo = await client.query(
      `
      SELECT id, vehicle_name, daily_rent_price, availability_status
      FROM vehicles
      WHERE id = $1
      FOR UPDATE;
      `,
      [vehicle_id]
    );

    if (vehicleInfo.rowCount === 0) {
      throw new Error("Vehicle not found");
    }

    const vehicle = vehicleInfo.rows[0];

    if (vehicle.availability_status !== "available") {
      throw new Error("Vehicle is not available");
    }

    //   Check overlapping bookings
    const overlapResult = await client.query(
      `
      SELECT 1
      FROM bookings
      WHERE vehicle_id = $1
        AND status = 'active'
        AND rent_start_date < $3
        AND rent_end_date > $2
      LIMIT 1
      `,
      [vehicle_id, rent_start_date, rent_end_date]
    );

    if ((overlapResult.rowCount ?? 0) > 0) {
      throw new Error("Vehicle already booked for selected dates");
    }

    // Price calculation
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const total_price = days * vehicle.daily_rent_price;

    //  Create booking
    const bookingResult = await client.query(
      `
      INSERT INTO bookings
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES
        ($1, $2, $3, $4, $5, 'active')
      RETURNING *;
      `,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    //  Update vehicle status
    await client.query(
      `
      UPDATE vehicles
      SET availability_status = 'booked'
      WHERE id = $1;
      `,
      [vehicle_id]
    );

    await client.query("COMMIT");

    return {
      booking: bookingResult.rows[0],
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getAllBookings = async (userId: number, role: "admin" | "customer") => {
  if (role === "admin") {
    const result = await pool.query(`
    SELECT
    b.id,
    b.customer_id,
    b.vehicle_id,
    b.rent_start_date,
    b.rent_end_date,
    b.total_price,
    b.status,
    u.name AS customer_name,
    u.email AS customer_email,
    v.vehicle_name,
    v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.created_at DESC
      `);
    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  }

  const result = await pool.query(
    `
    SELECT
    b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.created_at DESC
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

export const bookingServices = {
  createBooking,
  getAllBookings,
};
