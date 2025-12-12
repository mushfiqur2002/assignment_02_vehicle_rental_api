import { pool } from "../../config/db";
import { getUserFromDBById } from "../users/user.service";
import { vehicleService } from "../vehicles/vehicle.service";

async function getBookingFromDB() {
    const result = await pool.query(`SELECT * FROM bookings`)
    return result.rows
}
async function createBookingFromDB(bookingInfo: any) {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } = bookingInfo;

    // 1. Required fields check
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error("Missing required booking fields");
    }

    // 2. Convert dates
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    if (end <= start) {
        throw new Error("rent_end_date must be after rent_start_date");
    }

    // 3. Get number of days
    const diffTime = end.getTime() - start.getTime();
    const numberOfDays = diffTime / (1000 * 60 * 60 * 24);

    // 4. Check user exists
    const user = await getUserFromDBById(customer_id);
    if (!user) throw new Error("Customer not found");

    // 5. Check vehicle exists
    const vehicle = await vehicleService.getVehicleFromDBById(vehicle_id);
    if (!vehicle) throw new Error("Vehicle not found");

    // 6. Check availability
    if (vehicle.availability_status !== "available") {
        throw new Error("Vehicle is not available");
    }

    // 7. Calculate total price automatically
    const total_price = Number(numberOfDays) * Number(vehicle.daily_rent_price);

    // 8. Insert booking
    const result = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status || "active"]
    );

    const booking = result.rows[0];

    // 9. Mark vehicle as booked
    await pool.query(
        `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
        [vehicle_id]
    );

    return booking;
}

export const bookingService = {
    getBookingFromDB,
    createBookingFromDB
}
