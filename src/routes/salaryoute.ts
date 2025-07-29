import express from "express";
import { uploadSalaryExcel, getAllSalaries, updateSalaryController } from "../controllers/salaryController.js";
import { salaryUpload } from "../middlewares/salaryUploadMiddleware.js";

const router = express.Router();

router.post("/upload", salaryUpload.single("file"), uploadSalaryExcel);
router.get('/getSalaryData', getAllSalaries);
router.patch('/updateSalary/:id', updateSalaryController);

export default router;