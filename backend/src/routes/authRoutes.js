import express from "express";
import {
  forgetPassword,
  signIn,
  signUp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forget-password", forgetPassword);

export default router;
