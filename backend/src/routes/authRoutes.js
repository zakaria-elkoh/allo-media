import express from "express";
import {
  resetPassword,
  signIn,
  signUp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/reset-password", resetPassword);

export default router;
