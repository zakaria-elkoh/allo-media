import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    PhoneNumber: String,
    Address: String,
    role: { type: String, required: true, default: "user" },
    resetToken: String,
    resetTokenExpiration: String,
    twoStepVerification: { type: Boolean, default: false },
    otp: String,
    OTPExpiration: String,
  },
  { timestamps: true }
);

export default model("User", userSchema);
