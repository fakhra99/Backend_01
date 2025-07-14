import z from "zod";

export const createUser = z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("email is required"),
    password: z.string().min(6, "password is required"),
    role: z.string(),
    image: z.string()
})