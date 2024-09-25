import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, sendEmail } from "../utils/index.js";

const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ error: "User is already signed up!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    const token = generateToken(newUser, "1h");

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

    const token = generateToken(user, "1h");
    res.json({
      message: "User signed in successfully",
      data: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { signUp, signIn };
