import express from "express";
import {
  currentUser,
  forgetPassword,
  logIn,
  reSendOTP,
  resetPassword,
  signUp,
  toggleTwoStepVerification,
  verifyOTP,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/current-user", authMiddleware, currentUser);
router.post(
  "/two-step-verification",
  authMiddleware,
  toggleTwoStepVerification
);
router.post("/forget-password", forgetPassword);
router.get("/reset-password/:token", resetPassword);
router.post("/verify-otp/:userId", verifyOTP);
router.get("/resend-otp/:userId", reSendOTP);

export default router;
