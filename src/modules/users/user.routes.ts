import express, { Request, Response } from 'express';
import { userController } from './user.controller';

const router = express.Router()

router.get('/', (req, res) => {
    res.send('hello user route')
})

router.get('/users', userController.getUserController)

router.get('/users/:userId', userController.getUserControllerById)

router.post('/users', userController.createUserController)

router.put('/users/:userId', userController.updateUserController)

router.delete('/users/:userId', userController.deleteUserController)

export const userRouter = router