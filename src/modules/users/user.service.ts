import { pool } from "../../config/db";

// get users
export async function getUserFromDB() {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
}

// get users from id
export async function getUserFromDBById(id: any) {
    const userId = Number(id);
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    return result.rows[0];
}

// create a user
export async function createUserFromDB(userInfo: any) {
    console.log(userInfo);
    
    const { name, email, password, phone, role } = userInfo;

    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [name, email.toLowerCase(), password, phone, role]
    );

    return result.rows[0];
}

// update a user (admin or self, with protected admin roles)
export async function updateUserFromDB(targeterUserID: number, updateInfo: any, requesterID: number) {
    const requester = await getUserFromDBById(requesterID);
    if (!requester) {
        throw new Error("Requester not found");
    }

    const targetUser = await getUserFromDBById(targeterUserID);
    if (!targetUser) {
        throw new Error("Target user not found");
    }

    const isRequesterAdmin = requester.role === "admin";
    const isTargeterAdmin = targetUser.role === "admin";
    const isSelf = requester.id === targeterUserID;

    const { name, email, password, phone, role } = updateInfo;
    const { name: tName, email: tEmail, password: tPassword, phone: tPhone, role: tRole } = targetUser;

    if (!isRequesterAdmin && !isSelf) {
        throw new Error("You can only update your own profile");
    }

    if (isTargeterAdmin && role) {
        throw new Error("Cannot change role of an admin");
    }

    if (isSelf && role) {
        throw new Error("You cannot change your own role");
    }

    // empty input value convert with previous values (partial update)
    const finalName = name ?? tName;
    const finalEmail = email ?? tEmail;
    const finalPassword = password ?? tPassword;
    const finalPhone = phone ?? tPhone;

    // role logic
    let finalRole = tRole;
    if (isRequesterAdmin && role && !isTargeterAdmin) {
        const candidateRole = String(role).trim().toLowerCase();
        if (candidateRole === "admin" || candidateRole === "customer") {
            finalRole = candidateRole;
        } else {
            throw new Error("Invalid role value. Must be 'admin' or 'customer'.");
        }
    }

    const result = await pool.query(
        `UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *`,
        [finalName, finalEmail, finalPassword, finalPhone, finalRole, targeterUserID]
    );

    return result.rows[0];
}

// delete a user
export async function deleteUserFromDB(targeterUserID: any, requesterID: any) {

    const requester = await getUserFromDBById(requesterID);
    if (!requester) {
        throw new Error("Requester not found");
    }

    const targetUser = await getUserFromDBById(targeterUserID);
    if (!targetUser) {
        throw new Error("Target user not found");
    }

    const isRequesterAdmin = requester.role === "admin";
    const isTargeterAdmin = targetUser.role === "admin";

    // Only admin can delete
    if (!isRequesterAdmin) {
        throw new Error("Only admin can delete users");
    }

    // Admin cannot delete another admin
    if (isRequesterAdmin && isTargeterAdmin) {
        throw new Error("an admin can not delete another admin");
    }

    const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [targeterUserID]
    );
    return result.rows[0];
}

export const userService = {
    createUserFromDB,
    getUserFromDB,
    getUserFromDBById,
    updateUserFromDB,
    deleteUserFromDB,
};