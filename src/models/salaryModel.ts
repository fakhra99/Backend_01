import { Document } from "mongoose";
import mongoose from "mongoose";

export interface ISalary extends Document {
  employeeId: string;
  email: string;
  salaryMonth: string;
  salaryAmount: number;
  dateReceived: Date;
  description: string;
  advances: string;
  netSalary: number;
  status: string;
}

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  salaryMonth: {
    type: String,
    required: true,
  },
  salaryAmount: {
    type: Number,
    required: true,
  },
  dateReceived: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  advances: {
    type: String,
  },
  netSalary: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid", "Pending"],
    required: true,
  },
});

const salaryModel = mongoose.model<ISalary>("Salary", salarySchema);
export default salaryModel;
