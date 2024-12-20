import express from "express";
import routes from "./routes";

// set default port to 3000
const PORT = 3000
const app = express();

// middleware to parse incoming JSON data
app.use(express.json());

// set routes to routes folder
app.use("/", routes);

// start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
})
