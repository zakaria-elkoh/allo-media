import express from "express";
import {
  currentUser,
  forgetPassword,
  logIn,
  resetPassword,
  sendOTP,
  signUp,
  verifyOTP,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/current-user", authMiddleware, currentUser);
router.post("/forget-password", forgetPassword);
router.get("/reset-password/:token", resetPassword);
router.get("/get-otp/:userId", sendOTP);
router.post("/verify-otp/:userId", verifyOTP);

export default router;
