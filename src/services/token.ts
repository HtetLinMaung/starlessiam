import jwt from "jsonwebtoken";
import log from "../utils/log";

export const verifyToken = (token: string) => {
  log(`Decoding token: ${token}`);
  return jwt.verify(token, process.env.jwt_secret);
};
