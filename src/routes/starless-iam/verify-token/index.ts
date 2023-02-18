import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import { verifyToken } from "../../../services/token";
import handleAuthorization from "../../../utils/handle-authorization";

export default brewBlankExpressFunc(async (req, res) => {
  // const payload: any = await handleAuthorization(req);
  // if (process.env.app_code != payload.appcode) {
  //   throwErrorResponse(401, "Unauthorized!");
  // }

  const { token, accesskey } = req.body;
  if (process.env.access_key != accesskey) {
    throwErrorResponse(401, "Unauthorized!");
  }
  const decoded = verifyToken(token);
  res.json({
    code: 200,
    message: "Token is valid.",
    data: decoded,
  });
});
