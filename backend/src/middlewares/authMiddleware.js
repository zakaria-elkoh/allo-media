import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // Jbed token men l-header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("token:::", token);
    console.log("req.header('Authorization')", req.header("Authorization"));
    console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    // L9a l-user b l-id li f token
    const user = await userModel.findOne({ _id: decoded._id });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Zid l-user l request bash n9dro nsta3mloh f route handlers
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

export { authMiddleware };
