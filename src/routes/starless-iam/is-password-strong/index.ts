import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import Application from "../../../models/Application";
import validator from "validator";

export default brewBlankExpressFunc(async (req, res) => {
  const { appcode, password } = req.body;
  const application = await Application.findOne({
    code: appcode,
  });
  if (!application) {
    throwErrorResponse(404, "Application not found!");
  }
  const isStrong = validator.isStrongPassword(
    password,
    application.password_policy
  );
  res.json({
    code: 200,
    message: isStrong ? "Password is strong." : "Password is weak.",
    data: isStrong,
  });
});
