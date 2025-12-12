import { pool } from "../../config/db";

// Get all vehicles
async function getVehicleFromDB() {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result.rows;
}

// Get a vehicle by id
async function getVehicleFromDBById(id: any) {
    const vehicleId = Number(id);
    const result = await pool.query(
        `SELECT * FROM vehicles WHERE id = $1`,
        [vehicleId,]
    );
    return result.rows[0];
}

// Create a new vehicle
async function createVehicleFromDB(userInfo: any) {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = userInfo;

    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );
    return result.rows[0];
}

// Update vehicle (partial update supported)
export async function updateVehicleFromDB(targetVehicleID: number, updateInfo: any) {
    const targetVehicle = await getVehicleFromDBById(targetVehicleID);
    if (!targetVehicle) {
        throw new Error("Target vehicle not found");
    }

    // existing values
    const {
        vehicle_name: vName,
        type: vType,
        registration_number: vReg,
        daily_rent_price: vPrice,
        availability_status: vAvailability,
    } = targetVehicle;

    // incoming values
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = updateInfo;

    // merge: use provided value or fallback to existing
    const finalVehicleName = vehicle_name ?? vName;
    const finalRegistrationNumber = registration_number ?? vReg;
    const finalDailyRentPrice = Number(daily_rent_price) ?? vPrice;
    const finalType = type ?? vType;
    const finalAvailability = availability_status ?? vAvailability;

    // validations
    if (Number.isNaN(finalDailyRentPrice) || finalDailyRentPrice <= 0) {
        throw new Error("daily_rent_price must be a positive number");
    }

    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`,
        [finalVehicleName, finalType, finalRegistrationNumber, finalDailyRentPrice, finalAvailability, targetVehicleID]
    );

    return result.rows[0];
}

// Delete a vehicle by id
export async function deleteVehicleFromDB(targetVehicleID: any) {
    const result = await pool.query(
        `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
        [targetVehicleID]
    );
    return result.rows[0];
}

export const vehicleService = {
    getVehicleFromDB,
    getVehicleFromDBById,
    createVehicleFromDB,
    updateVehicleFromDB,
    deleteVehicleFromDB,
};
