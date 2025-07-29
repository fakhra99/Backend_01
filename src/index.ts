import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 

import { connectDB } from "./utils/connectToDb.js";
import userRoutes from "./routes/userRoutes.js";
import salaryRoutes from "./routes/salaryoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Use cors middleware (make sure this is BEFORE routes)
app.use(cors({
  origin: "http://localhost:5173", // Your Vite frontend port
  credentials: true,
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
