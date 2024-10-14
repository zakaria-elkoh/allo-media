import express from "express";
import "dotenv/config";
import connectDB from "./src/config/dbConfig.js";
import { authRoutes } from "./src/routes/index.js";
import cors from "cors";

const app = express();

const allowedOrigins = [process.env.FRONT_END, process.env.RONT_END_2];

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/test", async (req, res) => {
  res.json({
    success: true,
    message: "OTP sent successfully",
    data: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
      { id: 3, name: "Alice Doe" },
      { id: 4, name: "Alice Doe" },
      { id: 5, name: "Alice Doe" },
      { id: 6, name: "Alice Doe" },
      { id: 7, name: "Alice Doe" },
    ],
  });
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
