import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, sendEmail } from "../utils/index.js";
import { validateSignUp } from "../validations/signUpSchema.js";

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
      to: "zakariaelkoh00@gmail.com",
      subject: "Registration Confirmation",
      html: `<h1>Welcome to our platform!</h1><p>Please confirm your registration by clicking on the following link: <a href="http://localhost:3000/api/auth/confirmation/${token}">Confirm Registration</a></p>`,
    };
    sendEmail(emailInfo);

    res
      .status(201)
      .json({ message: "User created successfully", data: { token } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      message: "User signed in successfully",
      data: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const resetToken = generateToken(user);
    const resetTokenExpiration = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    const emailInfo = {
      to: user.email,
      subject: "Password Reset",
      html: `<h1>Reset Password</h1><p>Please click on the following link to reset your password: <a href="http://localhost:3000/api/auth/reset-password/${resetToken}">Reset Password</a></p><p>This link will expire in 1 hour.</p>`,
    };
    sendEmail(emailInfo);

    res.status(200).json({ message: "Reset password email sent successfully" });
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

export { signUp, signIn, forgetPassword, resetPassword };
