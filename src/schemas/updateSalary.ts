import z from "zod";

export const updateSalarySchema = z.object({
  salaryAmount: z.number().optional(),
  dateReceived: z.union([z.string(), z.date()]).optional(),
  description: z.string().optional(),
  advances: z.string().optional(),
  netSalary: z.number().optional(),
  status: z.string().optional()
}).strict(); // Will reject any unknown keys like email, salaryMonth, etc.
