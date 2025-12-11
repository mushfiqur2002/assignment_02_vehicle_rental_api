import express, { Request, Response } from 'express';
import { vehicleController } from './vehicle.controller';

const router = express.Router()

router.get('/vehicles', vehicleController.getVehicleController)
router.post('/vehicles', vehicleController.createVehicleController)

export const vehicleRouter = router