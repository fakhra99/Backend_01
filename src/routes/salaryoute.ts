import express from "express";
import { uploadSalaryExcel } from "../controllers/salaryController.js";
import { salaryUpload } from "../middlewares/salaryUploadMiddleware.js";

const router = express.Router();

router.post("/upload", salaryUpload.single("file"), uploadSalaryExcel);

export default router;