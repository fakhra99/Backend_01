import mongoose, { Document } from "mongoose";

export interface ISalaryFile extends Document {
  originalName: string;
  url: string;
  uploadDate: Date;
  uploadedBy?: mongoose.Types.ObjectId; // optional: if you have logged-in admin
}

const salaryFileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // assuming users upload
});

const salaryFileModel = mongoose.model<ISalaryFile>("SalaryFile", salaryFileSchema);
export default salaryFileModel;
