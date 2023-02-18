import User from "./models/User";
import { hashPassword } from "./services/password";
import connectMongoose from "./utils/connect-mongoose";
import generator from "generate-password";
import Application from "./models/Application";

export const afterMasterProcessStart = async () => {
  await connectMongoose();
  await Application.deleteMany({});
  await User.deleteMany({});
  const code = process.env.app_code;
  let application = await Application.findOne({
    code,
  });
  if (!application) {
    application = new Application({
      code,
      name: "Starless IAM",
    });
    await application.save();
  }
  const app = application._id;
  const username = process.env.admin_username;

  let user = await User.findOne({ username });
  if (!user) {
    user = new User({
      app,
      username,
    });
  }
  const password =
    process.env.admin_password ||
    generator.generate({
      length: 10,
      numbers: true,
    });
  console.log(`ADMIN PASSWORD: ${password}`);
  user.password = await hashPassword(password);
  await user.save();
};
