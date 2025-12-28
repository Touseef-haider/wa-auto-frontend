import {z} from "zod"

const registerSchema = z.object({
    phone: z.string().nonempty("phone is required"),
    business_name: z.string().nonempty("business name is required"),
    password: z.string().nonempty("password is required")
})

export type RegisterFormData = z.infer<typeof registerSchema>;

const loginSchema = z.object({
    business_name: z.string().nonempty("business name is required"),
    password: z.string().nonempty("password is required")
})

export type LoginFormData = z.infer<typeof loginSchema>;

export  {
    loginSchema,
    registerSchema
}