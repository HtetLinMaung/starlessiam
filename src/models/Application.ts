import { Schema, model } from "mongoose";
import { UserModel } from "./User";

export interface ApplicationModel {
  _id: string;
  code: string;
  name: string;
  public_register: boolean;
  jwt_expires_in: string;
  password_policy: any;
  max_login_attampts: number;
  lock_duration: number;
  lock_duration_unit: string;
  creater: string | UserModel;
}

const applicationSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    public_register: {
      type: Boolean,
      default: true,
    },
    jwt_expires_in: {
      type: String,
      default: "1d",
    },
    password_policy: {
      type: Schema.Types.Mixed,
      default: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      },
    },
    max_login_attampts: {
      type: Number,
      default: 3,
    },
    lock_duration: {
      type: Number,
      default: 15,
    },
    lock_duration_unit: {
      type: String,
      enum: ["y", "Q", "M", "w", "d", "h", "m", "s", "ms"],
      default: "m",
    },
    creater: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default model<ApplicationModel>("Application", applicationSchema);
