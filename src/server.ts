import "reflect-metadata"

import { AppDataSource } from "./data-source";
import express from "express";
import redis from "./redis";
import routes from "./routes";

// set default port
const PORT = process.env.APP_PORT || 3000
const app = express();

// middleware to parse incoming JSON data
app.use(express.json());


AppDataSource.initialize()
    .then(() => {
        redis.on('connect', () => console.log('Redis connected'));
        redis.on('error', (err) => console.error('Redis error:', err));
        // set routes to routes folder
        app.use("/", routes);

        // start the server
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}!`);
        })
    })
    .catch((error) => console.error('Error initializing Data Source:', error));
