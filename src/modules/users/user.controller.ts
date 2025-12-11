import { userService } from "./user.service";
import { Request, Response } from "express";

async function getUserController(req: Request, res: Response) {
    try {
        const result = await userService.getUserFromDB();

        res.status(200).json({
            success: true,
            message: "get a user",
            insertData: result,
        });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({
            success: false,
            message: "fail to get a user",
        });
    }
}

async function getUserControllerById(req: Request, res: Response) {
    const { userId } = req.params;

    try {
        const result = await userService.getUserFromDBById(Number(userId));

        res.status(200).json({
            success: true,
            message: "get a user by id",
            insertData: result,
        });
    } catch (error) {
        console.error("Error getting user by id:", error);
        res.status(500).json({
            success: false,
            message: "fail to get a user by id",
        });
    }
}

async function createUserController(req: Request, res: Response) {
    try {
        const data = req.body;
        const result = await userService.createUserFromDB(data);

        console.log('post data : ', data);
        console.log('result data : ', result);

        res.status(201).json({
            success: true,
            message: "create a user",
            insertData: result,
        });
    } catch (error: any) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "fail to create a user",
            error: error.message,
        });
    }
}

async function updateUserController(req: Request, res: Response) {
    const { userId } = req.params;
    const { requesterId } = req.query;
    const data = req.body;

    if (!requesterId) {
        return res.status(400).json({
            success: false,
            message: "requesterId is required",
        });
    }

    try {
        const result = await userService.updateUserFromDB(
            Number(userId),
            data,
            Number(requesterId)
        );

        res.status(200).json({
            success: true,
            message: "update a user",
            updatedData: result,
        });
    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: "fail to update a user",
            error: error.message,
        });
    }
}

async function deleteUserController(req: Request, res: Response) {
    const { userId } = req.params;
    const { requesterId } = req.query;

    if (!requesterId) {
        return res.status(400).json({
            success: false,
            message: "requesterId is required",
        });
    }

    try {
        const result = await userService.deleteUserFromDB(
            Number(userId),
            Number(requesterId)
        );

        res.status(200).json({
            success: true,
            message: "delete a user",
            deleteddata: result,
        });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "fail to delete data",
            error: error.message,
        });
    }
}

export const userController = {
    createUserController,
    getUserController,
    getUserControllerById,
    updateUserController,
    deleteUserController,
};
