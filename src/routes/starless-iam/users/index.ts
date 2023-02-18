import { brewExpressFuncCreateOrFindAll } from "code-alchemy";
import User from "../../../models/User";
import handleAuthorization from "../../../utils/handle-authorization";

export default brewExpressFuncCreateOrFindAll(
  User,
  {
    afterFunctionStart: async (req) => {
      if (process.env.access_key != req.query.accesskey) {
        await handleAuthorization(req);
      }
    },
  },
  "mongoose"
);
