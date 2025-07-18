import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectToDb.js";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
