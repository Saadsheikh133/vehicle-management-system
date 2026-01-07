import { pool } from "../../config/db";

interface CreateBookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

export const createBooking = async (payload: CreateBookingPayload) => {
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

export const bookingServices = {
  createBooking,
};
