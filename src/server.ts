// src/server.ts
import express from "express";
import { config } from "./config";
import { userRouter } from "./modules/users/user.routes";
import { createTables } from "./config/db";

const app = express();
const port = config.port;

app.use(express.json());
createTables()

app.get("/", (req, res) => {
    res.send('hello world')
})

app.use('/', userRouter)

app.listen(port, () => {
    console.log('server is runnig' + ' ' + port);
})