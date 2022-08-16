import dotenv from "dotenv";
import express from "express";

import { connect } from 'mongoose';
import verifyToken from './src/middleware/auth';
import authRouter from './src/routes/auth';
import dogRouter from './src/routes/dog';

// initialize configuration
dotenv.config();
const MONGO_URI = process.env.MONGO_URI
connect(MONGO_URI)

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();
app.use(express.json());

app.use(`/auth`, authRouter);
app.use(`/dogs`, dogRouter);

// Welcome
app.get("/welcome", verifyToken, (req, res) => {
  return res.status(200).send("Welcome 🙌 ");
});

app.get("/", (req, res) => {
  return res.status(200).send("Welcome 🙌 ");
});

// start the express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );