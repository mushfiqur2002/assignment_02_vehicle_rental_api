import express, { Request, Response } from 'express';
import { pool } from '../../config/db';
import { userController } from './user.controller';

const router = express.Router()

router.get('/api/v1/', (req, res) => {
    res.send('hello user route')
})

router.get('/api/v1/users', userController.getUserController)

router.get('/api/v1/users/:userId', userController.getUserControllerById)

router.post('/api/v1/users', userController.createUserController)

router.put('/api/v1/users/:userId', userController.updateUserController)

router.delete('/api/v1/users/:userId', userController.deleteUserController)

export const userRouter = router