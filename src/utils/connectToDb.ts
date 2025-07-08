import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const DbURI = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(DbURI);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
