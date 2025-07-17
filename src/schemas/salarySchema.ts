import z from "zod";

export const salaryValidation = z.object({
  email: z.string().email(),
  salaryMonth: z.string(),
  salaryAmount: z.number(),
  dateReceived: z.coerce.date(),
  description: z.string().optional(),
  advances: z.string().optional(),
  netSalary: z.number(),
  status: z.string(),
});