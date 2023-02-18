import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import Application from "../../../models/Application";
import User from "../../../models/User";
import connectMongoose from "../../../utils/connect-mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

export default brewBlankExpressFunc(async (req, res) => {
  const { appcode, username, password } = req.body;
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
  const app = application._id;
  if (!application) {
    throwErrorResponse(404, "Application not found!");
  }
  let user = await User.findOne({
    app,
    username,
  });
  if (!user) {
    throwErrorResponse(404, "User not found!");
  }
  if (user.lock_until && moment().isBefore(moment(user.lock_until))) {
    throwErrorResponse(401, "Your account is locked!");
  }
  const isPwdCorrect = await bcrypt.compare(password, user.password);
  if (!isPwdCorrect) {
    user = await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $inc: {
          login_attampts: 1,
        },
      }
    );
    if (user.login_attampts + 1 >= application.max_login_attampts) {
      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            lock_until: moment()
              .add(
                application.lock_duration,
                application.lock_duration_unit as any
              )
              .toISOString(),
            login_attampts: 0,
          },
        }
      );
    }

    throwErrorResponse(401, "Password is incorrect!");
  }
  const token = jwt.sign(
    {
      appcode: application.code,
      userid: user._id,
    },
    process.env.jwt_secret,
    {
      expiresIn: application.jwt_expires_in,
    }
  );
  res.json({
    code: 200,
    message: "Login successful.",
    data: {
      token,
      user_info: user.info,
    },
  });
});
