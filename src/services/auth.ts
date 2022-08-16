import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/user";

export const findUser = async (email: string) => {
    return User.findOne({ email });
}

export const createUser = async (email: string, password: string) => {
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

    return user
}