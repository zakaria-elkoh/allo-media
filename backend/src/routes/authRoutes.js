import express from "express";
import {
  forgetPassword,
  resetPassword,
  signIn,
  signUp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forget-password", forgetPassword);
router.get("/reset-password/:token", resetPassword);

export default router;
