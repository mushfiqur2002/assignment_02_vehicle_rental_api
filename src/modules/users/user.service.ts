import { pool } from "../../config/db"

export async function getUserFromDB() {
    const result = await pool.query(
        `SELECT * FROM users`
    );
    return result.rows;
}

export async function getUserFromDBById(id: any) {
    const userId = id
    const result = await pool.query(
        `SELECT * FROM users WHERE id=$1`, [userId]
    );
    return result.rows;
}

export async function createUserFromDB(userInfo: any) {
    const { name, email, password, phone, role } = userInfo;

    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role)VALUES ($1, $2, $3, $4, $5)RETURNING *;`, [name, email.toLowerCase(), password, phone, role]
    );
    return result.rows[0];
}



export const userService = {
    createUserFromDB,
    getUserFromDB,
    getUserFromDBById
}