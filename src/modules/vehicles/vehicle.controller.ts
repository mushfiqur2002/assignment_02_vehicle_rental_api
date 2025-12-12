import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";
import { pool } from "../../config/db";

async function getVehicleController(req: Request, res: Response) {
    try {
        const result = await vehicleService.getVehicleFromDB()
        res.status(200).json({
            success: true,
            message: 'get vehicles success',
            data: result
        })

    } catch (error: any) {
        res.status(200).json({
            success: false,
            message: 'get vehicles fail',
            data: error.message
        })
    }
}

async function getVehicleControllerById(req: Request, res: Response) {
    try {
        const { vehicleId } = req.params
        const result = await vehicleService.getVehicleFromDBById(vehicleId)
        res.status(200).json({
            success: true,
            message: 'get vehicles success',
            data: result
        })

    } catch (error: any) {
        res.status(200).json({
            success: false,
            message: 'get vehicles fail',
            data: error.message
        })
    }
}

async function createVehicleController(req: Request, res: Response) {
    try {
        const data = req.body
        const result = await vehicleService.createVehicleFromDB(data)

        console.log('post data : ', data);
        console.log('result data : ', result);

        res.status(200).json({
            success: true,
            message: 'create a vehicle successfully',
            data: result
        })
    } catch (error: any) {
        res.status(200).json({
            success: false,
            message: 'create a vehicle fail',
            data: error.message
        })
    }
}

async function updateVehicleController(req: Request, res: Response) {
    try {
        const data = req.body
        const { vehicleId } = req.params
        const result = await vehicleService.updateVehicleFromDB(Number(vehicleId), data)
        res.send(200).json({
            success: true,
            message: 'update vehicale',
            data: result
        })
    } catch (error: any) {
        res.send(500).json({
            success: true,
            message: 'update vehicale',
            error: error.message
        })
    }

}

async function deleteVehicleController(req: Request, res: Response) {
    try {
        const { vehicleId } = req.params
        const result = await vehicleService.deleteVehicleFromDB(Number(vehicleId));
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

export const vehicleController = {
    getVehicleController,
    getVehicleControllerById,
    createVehicleController,
    updateVehicleController,
    deleteVehicleController
};

