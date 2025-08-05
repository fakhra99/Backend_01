import xlsx from "xlsx";
import userModel from "../models/userModel.js";
import salaryModel from "../models/salaryModel.js";
import salaryFileModel from "../models/salaryFileModel.js";
import { salaryValidation } from "../schemas/salarySchema.js";
import { Request, Response } from "express";
import { sendEmail } from "../utils/sendEmail.js";
import { updateSalarySchema } from "../schemas/updateSalary.js";

// typescript type definition
type SalaryRow = {
  email: string;
  salaryMonth: string;
  salaryYear: number; 
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

    // Read Excel file
    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // sheet_to_json from the xlsx library always returns an array of objects
    const rows = xlsx.utils.sheet_to_json<SalaryRow>(sheet, {
      defval: "",
      raw: false
    });

    if (!rows.length) {
      return res.status(400).json({ message: "Excel file is empty." });
    }

  // Normalize and enrich rows
    const parsedData = rows.map((row) => {
      const dateReceived = new Date(row.dateReceived);
      return {
        email: String(row.email).trim().toLowerCase(),
        salaryMonth: row.salaryMonth.trim(),
        salaryAmount: Number(row.salaryAmount),
        dateReceived,
        salaryYear: Number(row.salaryYear),
        description: row.description,
        advances: row.advances,
        netSalary: Number(row.netSalary),
        status: row.status
      };
    });


    // Check for duplicate emails in uploaded file
    const emailList = parsedData.map((item) => item.email);
    const uniqueEmails = new Set(emailList);
    if (emailList.length !== uniqueEmails.size) {
      return res.status(400).json({
        message: "Duplicate emails found in the uploaded file. Upload rejected."
      });
    }

    // Use first row's month and year to check if file is already uploaded
    const { salaryMonth, salaryYear } = parsedData[0];

    const existing = await salaryModel.findOne({
      salaryMonth,
      salaryYear
    });

    if (existing) {
      return res.status(409).json({
        message: `Salaries for ${salaryMonth} ${salaryYear} have already been uploaded. Upload rejected.`
      });
    }

    // Save metadata of the uploaded file
    const savedFile = await salaryFileModel.create({
      originalName: file.originalname,
      url: `${req.protocol}://${req.get("host")}/uploads/salary/${file.filename}`,
      uploadedBy: req.body.uploadedBy || null
    });

    // Save each salary row
    for (const data of parsedData) {
      const result = salaryValidation.safeParse(data);
      // success is boolean (true or false) given by Zod.
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

      try {
        await sendEmail(
          data.email,
          `Your salary for ${data.salaryMonth}`,
          `Dear ${user.name || "Employee"},\n\nYour salary of Rs. ${data.salaryAmount} has been processed.\n\nNet Salary: Rs. ${data.netSalary}\nReceived on: ${new Date(data.dateReceived).toLocaleDateString()}\nStatus: ${data.status}\n\nRegards,\nHR Team`
        );
      } catch (emailError) {
        console.error(`Failed to send email to ${data.email}`, emailError);
      }
    }

    return res.status(200).json({
      message: "Salary data uploaded and emails sent successfully."
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllSalaries = async (req: Request, res: Response) => {
  try {
    // Extract pagination query params (all req.query values are strings)
    const page = parseInt(req.query.page as string) || 1;  // default page 1
    const limit = parseInt(req.query.limit as string) || 30; // default 30 rows/page
    const skip = (page - 1) * limit;

    // Extract month & year filters from query
    const month = req.query.month as string;
    const year = req.query.year as string;

    // Build MongoDB query object dynamically
    const query: any = {};
    if (month) {
      // Regex allows case-insensitive search (July == july == JULY)
      query.salaryMonth = new RegExp(`^${month}$`, "i");
    }
    if (year) {
      query.salaryYear = parseInt(year); // convert year to number
    }

    // Count total records for pagination (with applied filters)
    const totalCount = await salaryModel.countDocuments(query);

    // Fetch salaries with applied filters + pagination
    const salaries = await salaryModel
      .find(query)
      .populate("employeeId", "name email") // populate only name & email
      .skip(skip) // skip records for previous pages
      .limit(limit) // limit per page
      .lean(); // lean returns plain JS objects (faster)

    // Respond with paginated data + filters
    res.status(200).json({
      total: totalCount,   // total records matching filters
      page,                // current page
      totalPages: Math.ceil(totalCount / limit), // total pages
      data: salaries,  // salary list
    });

  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const updateSalaryController = async (req: Request, res: Response) => {
  try {
    const result = updateSalarySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const updatedSalary = await salaryModel.findByIdAndUpdate(
      req.params.id,
      result.data, // Use validated data only
      { new: true }
    );

    if (!updatedSalary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.json(updatedSalary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// delete api for slary
export const deleteSalary = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const deletedSalary = await salaryModel.findByIdAndDelete(id);

    if(!deletedSalary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.status(200).json({ message: "salary record deleted successfully", deletedSalary,})
  }
  catch (error) {
    console.error("Error deleting salary:", error);
    res.status(500).json({ message: "Server error", error });

  }
}

// DELETE /api/salaries/deleteAll
export const deleteAllSalariesController = async (req: Request, res: Response) => {
  try {
    // Delete all salary records-no filters
    const result = await salaryModel.deleteMany({});

    res.status(200).json({
      message: "All salary records deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all salaries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};