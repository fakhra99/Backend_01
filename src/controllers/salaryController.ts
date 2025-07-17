import xlsx from "xlsx";
import userModel from "../models/userModel.js";
import salaryModel from "../models/salaryModel.js";
import salaryFileModel from "../models/salaryFileModel.js";
import { salaryValidation } from "../schemas/salarySchema.js";
import { Request, Response } from "express";

type SalaryRow = {
  email: string;
  salaryMonth: string;
  salaryAmount: number;
  dateReceived: string | Date;
  description?: string;
  advances?: string;
  netSalary: number;
  status: string;
};

export const uploadSalaryExcel = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save file metadata
    const savedFile = await salaryFileModel.create({
      originalName: file.originalname,
      url: `${req.protocol}://${req.get("host")}/uploads/salary/${file.filename}`,
      uploadedBy: req.body.uploadedBy || null,
    });

    // Read Excel and parse rows into objects
    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json<SalaryRow>(sheet, {
      defval: "",
      raw: false
    });

    console.log("Parsed rows:", rows);

    for (const row of rows) {
      const data = {
        email: String(row.email).trim().toLowerCase(),
        salaryMonth: row.salaryMonth,
        salaryAmount: Number(row.salaryAmount),
        dateReceived: new Date(row.dateReceived),
        description: row.description,
        advances: row.advances,
        netSalary: Number(row.netSalary),
        status: row.status
      };

      const result = salaryValidation.safeParse(data);
      if (!result.success) {
        console.log("Validation failed:", data.email, result.error.errors);
        continue;
      }

      const user = await userModel.findOne({ email: data.email });
      if (!user) {
        console.log("User not found for:", data.email);
        continue;
      }

      await salaryModel.create({
        employeeId: user._id,
        ...data,
        sourceFile: savedFile._id
      });
    }

    return res.status(200).json({ message: "Salary data uploaded successfully" });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
