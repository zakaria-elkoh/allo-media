import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    PhoneNumber: String,
    Address: String,
    role: { type: String, required: true, default: "user" },
  },
  { timestamps: true }
);

export default model("User", userSchema);
