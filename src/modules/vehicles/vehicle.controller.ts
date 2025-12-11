import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

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

export const vehicleController = {
    getVehicleController,
    createVehicleController
};

