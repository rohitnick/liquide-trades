import "reflect-metadata"

import { AppDataSource } from "./data-source";
import express from "express";
import routes from "./routes";

// set default port
const PORT = process.env.APP_PORT || 3000
const app = express();

// middleware to parse incoming JSON data
app.use(express.json());


AppDataSource.initialize()
    .then(() => {
        // set routes to routes folder
        app.use("/", routes);

        // start the server
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}!`);
        })
    })
    .catch((error) => console.error('Error initializing Data Source:', error));
