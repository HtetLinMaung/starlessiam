import { throwErrorResponse } from "code-alchemy";
import { Request } from "express";
import { verifyToken } from "../services/token";
import log from "./log";

export default function handleAuthorization(req: Request) {
  log("Checking jwt token");
  let token = null;
  const authHeader = req.get("authorization");
  if (authHeader) {
    token = authHeader.replace("Bearer ", "").trim();
  } else {
    token = req.query.token as string;
  }
  if (!token) {
    throwErrorResponse(401, "Token is required!");
  }

  let decoded = null;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    log(`Decoding token failed`);
    throwErrorResponse(401, err.message);
  }
  console.log(decoded);
  return decoded;
}
