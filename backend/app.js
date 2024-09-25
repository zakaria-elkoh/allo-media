import express from "express";
import "dotenv/config";

import connectDB from "./src/config/dbConfig.js";
// import { sendOTPVerificationEmail } from "./src/controllers/authController.js";
import { authRoutes } from "./src/routes/index.js";
import sendEmail from "./src/utils/sendEmail.js";

const app = express();

app.get("/", (req, res) => {
  // sendOTPVerificationEmail();
  sendEmail();
  res.send("email was sent!");
});

// Middleware
app.use(express.json());
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
connectDB();
