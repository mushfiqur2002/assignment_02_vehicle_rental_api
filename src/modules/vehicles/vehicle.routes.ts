import express, { Request, Response } from 'express';
import { vehicleController } from './vehicle.controller';

const router = express.Router()

router.get('/vehicles', vehicleController.getVehicleController)
router.get('/vehicles/:vehicleId', vehicleController.getVehicleControllerById)
router.post('/vehicles', vehicleController.createVehicleController)
router.put('/vehicles/:vehicleId', vehicleController.updateVehicleController)
router.delete('/vehicles/:vehicleId', vehicleController.deleteVehicleController)


export const vehicleRouter = router