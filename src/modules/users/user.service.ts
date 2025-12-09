import { userInfo } from "os";
import { pool } from "../../config/db"
import { error } from "console";

// get users
export async function getUserFromDB() {
    const result = await pool.query(
        `SELECT * FROM users`
    );
    return result.rows;
}

// get users from id
export async function getUserFromDBById(id: any) {
    const userId = id
    const result = await pool.query(
        `SELECT * FROM users WHERE id=$1`, [userId]
    );
    return result.rows[0];
}

// create a user
export async function createUserFromDB(userInfo: any) {
    const { name, email, password, phone, role } = userInfo

    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role)VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [name, email.toLowerCase(), password, phone, role]
    );
    return result.rows[0];
}

// update a user only admin
export async function updateUserFromDB(targeterUserID: number, updateInfo: any, requesterID: number) {
    const requester = await getUserFromDBById(requesterID);
    const isRequesterAdmin = requester.role === "admin";

    const targetUser = await getUserFromDBById(targeterUserID);
    const isTargeterAdmin = targetUser.role === "admin";

    // previou data 
    const {
        name: tName,
        email: tEmail,
        password: tPassword,
        phone: tPhone,
        role: tRole,
    } = targetUser;

    // data from req body
    const { name, email, password, phone, role } = updateInfo;
    console.log('update info :', updateInfo);


    // check that any filed empty or not
    const finalName = name ?? tName;
    const finalEmail = email ?? tEmail;
    const finalPassword = password ?? tPassword;
    const finalPhone = phone ?? tPhone;

    let finalRole = tRole;
    if (isRequesterAdmin && role && !isTargeterAdmin) {
        finalRole = role;
    }

    const result = await pool.query(
        `UPDATE users SET name = $1,email = $2,password = $3,phone = $4,role = $5 WHERE id = $6 RETURNING *`,
        [finalName, finalEmail, finalPassword, finalPhone, finalRole, targeterUserID]
    );

    return result.rows[0];
}

// delete a user 
export async function deleteUserFromDB(targeterUserID: any, requesterID:any) {
    const requester = await getUserFromDBById(requesterID);
    const isRequesterAdmin = requester.role === "admin";

    const targetUser = await getUserFromDBById(targeterUserID);
    const isTargeterAdmin = targetUser.role === "admin";

    if(isRequesterAdmin && isTargeterAdmin){
        throw error('an admin can not delete another admin')
        // return console.log('an admin can not delete another admin');
        
    }

    const result = await pool.query(
        `DELETE FROM users WHERE id=$1`,[targeterUserID]
    )
    console.log('requester :', requester);
    console.log('targeter :', targetUser);

    return result.rows[0]
    
}





export const userService = {
    createUserFromDB,
    getUserFromDB,
    getUserFromDBById,
    updateUserFromDB,
    deleteUserFromDB
}




// export async function updateUserFromDB(targetUserID: number, updateInfo: any, requesterID: number) {
//     const requester = await getUserFromDBById(requesterID);
    
//     if (!requester) throw new Error("Requester not found");

//     const isAdmin = requester.role === "admin";

//     const targetUser = await getUserFromDBById(targetUserID);
//     if (!targetUser) throw new Error("Target user not found");

//     const isSelf = requesterID === targetUserID;
//     const targetIsAdmin = targetUser.role === "admin";

//     // Only admin or self can update
//     if (!isAdmin && !isSelf) {
//         throw new Error("You can only update your own profile");
//     }

//     // Protect admins from role changes
//     if (targetIsAdmin && updateInfo.role) {
//         throw new Error("Cannot change role of an admin");
//     }

//     if (isSelf && updateInfo.role) {
//         throw new Error("You cannot change your own role");
//     }

//     // Merge non-role fields (partial update)
//     const finalName = updateInfo.name ?? targetUser.name;
//     const finalEmail = updateInfo.email ?? targetUser.email;
//     const finalPassword = updateInfo.password ?? targetUser.password;
//     const finalPhone = updateInfo.phone ?? targetUser.phone;

//     // Role logic
//     let finalRole = targetUser.role; // start with existing role

//     if (isAdmin && updateInfo.role && !targetIsAdmin) {
//         const candidateRole = String(updateInfo.role).trim().toLowerCase();
//         if (candidateRole === "admin" || candidateRole === "customer") {
//             finalRole = candidateRole;
//         } else {
//             throw new Error("Invalid role value. Must be 'admin' or 'customer'.");
//         }
//     }

//     const result = await pool.query(
//         `UPDATE users 
//      SET name = $1,
//          email = $2,
//          password = $3,
//          phone = $4,
//          role = $5
//      WHERE id = $6
//      RETURNING *`,
//         [finalName, finalEmail, finalPassword, finalPhone, finalRole, targetUserID]
//     );

//     return result.rows[0];
// }