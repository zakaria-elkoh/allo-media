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

    const emailInfo = {
      to: newUser.email,
      subject: "Registration Confirmation",
      html: `<h1>Welcome to our platform!</h1><p>Please confirm your registration by clicking on the following link: <a href="http://localhost:3000/api/auth/confirmation/${token}">Confirm Registration</a></p>`,
    };
    sendEmail(emailInfo);

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
      const otpExpiration = Date.now() + 600000; // 10 mins
      user.otp = otp;
      user.OTPExpiration = otpExpiration;
      await user.save();
      const emailInfo = {
        to: user.email,
        subject: "Password Reset",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Two-Step Verification Code</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                      color: #333333;
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                  }
                  .container {
                      background-color: #f9f9f9;
                      border-radius: 5px;
                      padding: 20px;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #0066cc;
                      text-align: center;
                  }
                  .otp {
                      background-color: #e6f2ff;
                      font-size: 24px;
                      font-weight: bold;
                      text-align: center;
                      padding: 10px;
                      margin: 20px 0;
                      border-radius: 5px;
                  }
                  .footer {
                      margin-top: 20px;
                      text-align: center;
                      font-size: 12px;
                      color: #666666;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Two-Step Verification Code</h1>
                  <p>Hello,</p>
                  <p>Your two-step verification code is:</p>
                  <div class="otp">${otp}</div>
                  <p>Please enter this code to complete your login process. This code will expire in 10 minutes.</p>
                  <p>If you didn't attempt to log in, please secure your account and contact our support team immediately.</p>
                  <div class="footer">
                      <p>This is an automated message, please do not reply to this email.</p>
                      <p>If you need assistance, please contact our support team.</p>
                      <p>&copy; 2024 YourCompanyName. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
          `,
      };
      sendEmail(emailInfo);
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

// setTimeout 3000
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ error: "Sorry, We could not found your account" });

    const resetToken = generateToken(user);
    const resetTokenExpiration = Date.now() + 3600000; // 60 mins

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    const emailInfo = {
      to: user.email,
      subject: "Reset Your Password",
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                      color: #333333;
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                  }
                  .container {
                      background-color: #f9f9f9;
                      border-radius: 5px;
                      padding: 20px;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #0066cc;
                      text-align: center;
                  }
                  .button {
                      display: inline-block;
                      background-color: #0066cc;
                      color: #ffffff !important;
                      text-decoration: none;
                      padding: 10px 20px;
                      border-radius: 5px;
                      margin-top: 20px;
                  }
                  .footer {
                      margin-top: 20px;
                      text-align: center;
                      font-size: 12px;
                      color: #666666;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Reset Your Password</h1>
                  <p>Hello,</p>
                  <p>We received a request to reset your password. Please click on the following button to reset your password:</p>
                  <p style="text-align: center;">
                      <a href="${process.env.BACK_END}/api/auth/reset-password/${resetToken}" class="button">Reset Password</a>
                  </p>
                  <p>If you didn't request a password reset, please ignore this email or contact our support team if you have any concerns.</p>
                  <p><strong>Please note:</strong> This link will expire in 1 hour for security reasons.</p>
                  <div class="footer">
                      <p>This is an automated message, please do not reply to this email.</p>
                      <p>If you need assistance, please contact our support team.</p>
                      <p>&copy; 2024 YourCompanyName. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `,
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

// setTimeout 3000
const verifyOTP = async (req, res) => {
  try {
    setTimeout(async () => {
      const otp = req.body.otp;

      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).json({ error: "User not found" });

      if (!user.otp || !user.OTPExpiration)
        return res.status(400).json({ error: "OTP not found or expired" });

      if (Date.now() > user.OTPExpiration)
        return res.status(400).json({ error: "OTP has expired" });
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

// setTimeout 2000
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

// setTimeout 2000
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

const reSendOTP = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) res.status(400).json({ error: "User not found" });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiration = Date.now() + 600000; // 10 mins
    user.otp = otp;
    user.OTPExpiration = otpExpiration;
    await user.save();
    const emailInfo = {
      to: user.email,
      subject: "Password Reset",
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Two-Step Verification Code</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                      color: #333333;
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                  }
                  .container {
                      background-color: #f9f9f9;
                      border-radius: 5px;
                      padding: 20px;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #0066cc;
                      text-align: center;
                  }
                  .otp {
                      background-color: #e6f2ff;
                      font-size: 24px;
                      font-weight: bold;
                      text-align: center;
                      padding: 10px;
                      margin: 20px 0;
                      border-radius: 5px;
                  }
                  .footer {
                      margin-top: 20px;
                      text-align: center;
                      font-size: 12px;
                      color: #666666;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Two-Step Verification Code</h1>
                  <p>Hello,</p>
                  <p>Your two-step verification code is:</p>
                  <div class="otp">${otp}</div>
                  <p>Please enter this code to complete your login process. This code will expire in 10 minutes.</p>
                  <p>If you didn't attempt to log in, please secure your account and contact our support team immediately.</p>
                  <div class="footer">
                      <p>This is an automated message, please do not reply to this email.</p>
                      <p>If you need assistance, please contact our support team.</p>
                      <p>&copy; 2024 YourCompanyName. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
          `,
    };
    sendEmail(emailInfo);
    res.status(200).json({ message: "OTP was sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
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
  reSendOTP,
};
