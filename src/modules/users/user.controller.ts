import { userInfo } from "os";
import { userService } from "./user.service";
import { Request, Response } from "express";

async function getUserController(req: Request, res: Response) {
    try {
        const result = await userService.getUserFromDB();
        res.status(201).json({
            success: true,
            message: "get a user",
            insertData: result, // result is already the inserted row
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "fail to create a user",
        });
    }
}

async function getUserControllerById(req: Request, res: Response) {
    const { userId } = req.params
    console.log(userId);

    try {
        const result = await userService.getUserFromDBById(userId);
        res.status(201).json({
            success: true,
            message: "get a user by id",
            insertData: result, // result is already the inserted row
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "fail to get a user by id",
        });
    }
}

async function createUserController(req: Request, res: Response) {
    try {
        const data = req.body;
        console.log("Incoming user data:", data);

        const result = await userService.createUserFromDB(data);

        res.status(201).json({
            success: true,
            message: "create a user",
            insertData: result, // result is already the inserted row
        });
    } catch (error: any) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "fail to create a user",
            error: error.message
        });
    }
}

async function updateUserController(req: Request, res: Response) {
    const { userId } = req.params;
    const { requesterId } = req.query
    const data = req.body;



    try {
        const result = await userService.updateUserFromDB(Number(userId), data, Number(requesterId));

        res.status(200).json({
            success: true,
            message: "update a user",
            updatedData: result,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "fail to update a user",
            error: error.message,
        })
    }
}

async function deleteUserController(req: Request, res: Response) {
    const { userId } = req.params
    const { requesterId } = req.query

    console.log(userId,requesterId);
    
    try {
        const result = await userService.deleteUserFromDB(Number(userId), Number(requesterId))
        res.status(200).json({
            success: true,
            message: "delete a user",
            deleteddata: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "fail to delete data",
            error: error.message
        })
    }
}


export const userController = {
    createUserController,
    getUserController,
    getUserControllerById,
    updateUserController,
    deleteUserController
};
