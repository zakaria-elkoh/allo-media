import express from "express";
import {
  forgetPassword,
  resetPassword,
  sendOTP,
  signIn,
  signUp,
  verifyOTP,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forget-password", forgetPassword);
router.get("/reset-password/:token", resetPassword);
router.get("/get-otp/:userId", sendOTP);
router.post("/verify-otp/:userId", verifyOTP);

export default router;
