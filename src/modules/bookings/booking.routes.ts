import express, { Request, Response } from 'express';
import { bookingController } from './booking.controller';

const router = express.Router()

router.get('/bookings', bookingController.getBookingController)
router.post('/bookings', bookingController.createBookingController)

export const bookingRouter = router