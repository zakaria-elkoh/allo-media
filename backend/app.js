import express from "express";
const app = express();
import "dotenv/config";
import connectDB from "./config/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import { sendOTPVerificationEmail } from "./controllers/authController.js";

app.get("/", (req, res) => {
  sendOTPVerificationEmail();
  res.send("hello niggas!");
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
