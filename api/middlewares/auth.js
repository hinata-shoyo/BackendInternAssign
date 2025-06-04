import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "access denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "invalid token" });
  }
};
