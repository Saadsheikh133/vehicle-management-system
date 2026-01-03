import { Pool } from "pg";
import config from ".";

//DB
export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(15) NOT NULL CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price INT CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date date NOT NULL,
        rent_end_date date NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price INT NOT NULL CHECK (total_price > 0),
        status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
};

export default initDB;
