import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import sendEmail from "./sendEmail.js";

const sendOTPByEmail = async (userId) => {
  try {
    console.log("userId:::::", userId);

    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    console.log("user:::::", user);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiration = Date.now() + 600000; // 10 minutes

    // const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = otp;
    user.OTPExpiration = otpExpiration;
    await user.save();

    // const to = "zakariaelkoh00@gmail.com";
    // const subject = "Your OTP for Two-Step Verification";
    // const html = `Your OTP is ${otp}. It will expire in 10 minutes.`;

    // sendEmail({ to, subject, html });

    return { message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export { sendOTPByEmail };
