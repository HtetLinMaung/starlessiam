import mongoose from "mongoose";
import log from "./log";

export default async function connectMongoose() {
  log("Connecting to Mongo DB");
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.connection_string);
  log("Mongo DB connected successful.");
}
