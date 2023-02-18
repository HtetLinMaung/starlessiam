import { Schema, model } from "mongoose";
import { ApplicationModel } from "./Application";

export interface UserModel {
  _id: string;
  app: string | ApplicationModel;
  username: string;
  password: string;
  two_factor_auth: boolean;
  login_attampts: number;
  lock_until: string;
  info: any;
  creater: string | UserModel;
}

const userSchema = new Schema(
  {
    app: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    two_factor_auth: {
      type: Boolean,
      default: false,
    },
    login_attampts: {
      type: Number,
      default: 0,
    },
    lock_until: {
      type: String,
      default: "",
    },
    info: {
      type: Schema.Types.Mixed,
      default: {},
    },
    creater: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default model<UserModel>("User", userSchema);
