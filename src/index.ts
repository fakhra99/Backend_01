import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectToDb.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
