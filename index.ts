import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connect } from 'mongoose';
import verifyToken from './src/middleware/auth';

import User from "./src/model/user";

// initialize configuration
dotenv.config();
const MONGO_URI = process.env.MONGO_URI
connect(MONGO_URI)

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();
app.use(express.json());

// Register
app.post("/register", async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
          return res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }

        // Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user: any = await User.create({
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;

        // return new user
        return res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
    });

// Login
app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user: any = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

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