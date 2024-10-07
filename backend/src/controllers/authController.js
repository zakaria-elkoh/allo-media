import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, sendEmail } from "../utils/index.js";
import { validateSignUp } from "../validations/signUpSchema.js";
import { sendOTPByEmail } from "../utils/sendOTP.js";
import "dotenv/config";

const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ error: "User is already signed up!" });

    const { error } = validateSignUp(req.body);
    if (error)
      return res.status(400).json({ error: "Invalid input!!!", data: error });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    const token = generateToken(newUser);

    // const emailInfo = {
    //   to: "zakariaelkoh00@gmail.com",
    //   subject: "Registration Confirmation",
    //   html: `<h1>Welcome to our platform!</h1><p>Please confirm your registration by clicking on the following link: <a href="http://localhost:3000/api/auth/confirmation/${token}">Confirm Registration</a></p>`,
    // };
    // sendEmail(emailInfo);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { token, user: { ...newUser._doc, password: null } },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (user.twoStepVerification === true) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const otpExpiration = Date.now() + 600000; // 10 minutes
      // const hashedOTP = await bcrypt.hash(otp, 10);
      user.otp = otp;
      user.OTPExpiration = otpExpiration;
      await user.save();
      res.json({
        success: true,
        message: "Please enter the OTP sent to your email",
        data: {
          user: {
            ...user._doc,
            password: null,
            OTPExpiration: null,
            otp: null,
          },
        },
      });
    } else {
      const token = generateToken(user);
      res.json({
        success: true,
        message: "User signed in successfully",
        data: { token, user: { ...user._doc, password: null } },
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ error: "Sorry, We could not found your account" });

    const resetToken = generateToken(user);
    const resetTokenExpiration = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    const emailInfo = {
      to: user.email,
      subject: "Password Reset",
      html: `<h1>Reset Password</h1><p>Please click on the following link to reset your password: <a href="${process.env.BACK_END}/api/auth/reset-password/${resetToken}">Reset Password</a></p><p>This link will expire in 1 hour.</p>`,
    };
    sendEmail(emailInfo);

    setTimeout(() => {
      res.status(200).json({
        message: "We've sent a password reset link to your email address",
      });
    }, 3000);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const resetToken = req.params.token;
    const user = await User.findOne({ resetToken });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired reset token" });
    if (user.resetTokenExpiration < Date.now())
      return res.status(400).json({ error: "Reset token has expired" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const sendOTP = async (req, res) => {
//   try {
//     const isSent = await sendOTPByEmail(req.params.userId);
//     if (!isSent) {
//       throw new Error("Failed to send OTP");
//     }
//     res.status(200).json({ message: "OTP was sent successfully" });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw error;
//   }
// };

const verifyOTP = async (req, res) => {
  try {
    setTimeout(async () => {
      const otp = req.body.otp;
      console.log("otp:::::", otp);

      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).json({ error: "User not found" });
      console.log("user:::::", user);

      if (!user.otp || !user.OTPExpiration)
        return res.status(400).json({ error: "OTP not found or expired" });

      if (Date.now() > user.OTPExpiration)
        return res.status(400).json({ error: "OTP has expired" });
      // const isValid = await bcrypt.compare(otp, user.otp);
      const isValid = otp === user.otp;

      if (!isValid) return res.status(400).json({ error: "Invalid OTP" });

      user.otp = undefined;
      user.OTPExpiration = undefined;
      user.twoStepVerification = true;
      await user.save();

      const token = generateToken(user);
      res.status(200).json({
        success: true,
        message: "User signed in successfully",
        data: { token, user: { ...user._doc, password: null } },
      });
    }, 3000);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error });
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    setTimeout(() => {
      res
        .status(200)
        .json({ success: true, message: "User retrieved successfully", user });
    }, 2000);
  } catch (error) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const toggleTwoStepVerification = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      twoStepVerification: req.body.twoStepVerification,
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    setTimeout(() => {
      res.status(200).json({
        success: true,
        message: "Two-step verification toggled successfully",
        data: { twoStepVerification: req.body.twoStepVerification },
      });
    }, 2000);
  } catch (error) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
  signUp,
  logIn,
  forgetPassword,
  resetPassword,
  verifyOTP,
  currentUser,
  toggleTwoStepVerification,
};
