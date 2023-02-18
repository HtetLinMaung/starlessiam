import bcrypt from "bcryptjs";
import log from "../utils/log";

export const hashPassword = async (password: string) => {
  log(`Hashing password: ${password}`);
  return await bcrypt.hash(password, 12);
};
