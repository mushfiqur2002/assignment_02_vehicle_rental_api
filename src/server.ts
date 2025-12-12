// src/server.ts
import express from "express";
import { config } from "./config";
import { userRouter } from "./modules/users/user.routes";
import { createTables } from "./config/db";
import { userService } from "./modules/users/user.service";
import { vehicleService } from "./modules/vehicles/vehicle.service";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes";
import { bookingRouter } from "./modules/bookings/booking.routes";

const app = express();
const port = config.port;

app.use(express.json());
createTables()

app.get("/", (req, res) => {
    res.send('hello world')
})

app.use('/api/v1', userRouter)

app.use('/api/v1', vehicleRouter)

app.use('/api/v1', bookingRouter)


app.listen(port, () => {
    console.log('server is runnig' + ' ' + port);
})