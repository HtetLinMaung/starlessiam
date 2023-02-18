import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import validator from "validator";
import Application from "../../../models/Application";
import User from "../../../models/User";
import { hashPassword } from "../../../services/password";
import { createUser } from "../../../services/user";
import connectMongoose from "../../../utils/connect-mongoose";

export default brewBlankExpressFunc(async (req, res) => {
  const { username, password, appcode } = req.body;
  if (!username) {
    throwErrorResponse(400, "Username is required!");
  }
  if (!password) {
    throwErrorResponse(400, "Password is required!");
  }
  if (!appcode) {
    throwErrorResponse(400, "Application Code is required!");
  }
  await connectMongoose();
  const application = await Application.findOne({
    code: appcode,
  });
  if (!application.public_register) {
    throwErrorResponse(401, "Public registration is not allowed!");
  }
  const app = application._id;
  if (!application) {
    throwErrorResponse(404, "Application not found!");
  }
  let user = await User.findOne({
    username,
    app,
  });
  if (user) {
    throwErrorResponse(400, "User already existed!");
  }

  if (!validator.isStrongPassword(password, application.password_policy)) {
    throwErrorResponse(400, "Your password is weak!");
  }
  await createUser(app, username, await hashPassword(password));
  res.json({
    code: 200,
    message: "User registered successful.",
  });
});
