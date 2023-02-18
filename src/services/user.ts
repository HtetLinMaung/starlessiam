import User from "../models/User";
import bcrypt from "bcryptjs";
import log from "../utils/log";

export const createUser = async (
  app: string,
  username: string,
  password: string
) => {
  log(`Creating new user`);
  const user = new User({
    app,
    username,
    password: await bcrypt.hash(password, 12),
  });
  await user.save();
  log("User created successful.");
  console.log(user);
  return user;
};
