import express, { Request, Response } from 'express';
import { pool } from '../../config/db';

async function getVehicleFromDB() {
    const result = await pool.query(`SELECT * FROM vehicles`)
    return result.rows
}

async function getVehicleFromDBById(id: any) {
    const userId = Number(id)
    const result = await pool.query(`SELECT * FROM vehicles  WHERE id=$1`, [userId])
    return result.rows[0]
}
async function createVehicleFromDB(userInfo: any) {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = userInfo

    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    )
    return result.rows[0]
}

export const vehicleService = {
    getVehicleFromDB,
    getVehicleFromDBById,
    createVehicleFromDB
}