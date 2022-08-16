import { Request, Response, Router } from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUser, findUser } from "../services/auth";
const router = Router();


// Register
router.post("/register", async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
          return res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await findUser(email)

        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }

        // Create new user
        const user : any = await createUser(email, password)

        // return new user
        return res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
    });

// Login
router.post("/login", async (req, res) => {

  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user : any = await findUser(email)

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
});

export default router;