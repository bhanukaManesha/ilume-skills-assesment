import jwt from "jsonwebtoken";

const config = process.env;

const verifyToken = (req: any, res: any, next: any) => {
  // Middleware to verify if the JWT token is valid and append the decoded user from the token

  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    // decode the user and push on the the request object
    const decoded = jwt.verify(token.substring(7, token.length), config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export default verifyToken;