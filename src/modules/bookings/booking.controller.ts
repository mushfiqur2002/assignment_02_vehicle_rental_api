import { Request, Response } from "express";
import { bookingService } from "./booking.service";

async function getBookingController(req: Request, res: Response) {
    try {
        const result = await bookingService.getBookingFromDB()
        res.status(200).json({
            success: true,
            message: 'get a booking successfully',
            data: result
        })
    } catch (error: any) {
        res.status(200).json({
            success: false,
            message: 'create a booking fail',
            data: error.message
        })
    }
}

async function createBookingController(req: Request, res: Response) {
    try {
        const data = req.body
        const result = await bookingService.createBookingFromDB(data)

        console.log('post data : ', data);
        console.log('result data : ', result);

        res.status(200).json({
            success: true,
            message: 'create a booking successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'create a booking fail',
            data: error.message
        })
    }
}

export const bookingController = {
    getBookingController,
    createBookingController
}