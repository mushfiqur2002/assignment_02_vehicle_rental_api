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

export const userRouter = router