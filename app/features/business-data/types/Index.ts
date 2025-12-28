import {z} from "zod"

export const businessFileSchema = z.object({
  file: z.instanceof(File, { message: "Please upload file" })
});




export type BusinessFileUpload = z.infer<typeof businessFileSchema>


