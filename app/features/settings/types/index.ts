
import {z} from "zod"

export const businessProfileSchema = z.object({
    phone: z.string().nonempty("phone is required"),
    business_name: z.string().nonempty("business name is required"),
    email: z.email(),
    addresses: z.array(z.string()),
    website: z.string(),
})


export type businessProfileFormData = z.infer<typeof businessProfileSchema>;

export type BusinessPatchResponseType = {
    message: string,
}


export type BusinessResponseType = {
    message: string,
    data: BusinessType
}


export type BusinessType = {
    _id?:string,
    phone: string,
    email?: string,
    logo?: string,
    addresses?: string[],
    website?: string,
    business_name:string
}

