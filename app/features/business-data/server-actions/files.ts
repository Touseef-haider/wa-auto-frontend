"use server"

import { checkAxiosEror, http } from "@/app/utils/http"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export type BusinessFile = {
    filename: string
    metadata: {
        business_id: string
        user_id: string
    }
    user:string
}


export type BusinessFileResponseType = {
    message: string,
    data: {
        total:number,
        result: BusinessFile[]
    }
}




export type BusinessFileUploadResponseType = {
    message: string,
    data: {
        document_id:string
    }
}

export const getBusinessFile = async (pageSize:number=1,limit:number=10)=>{
    try {

        const token = (await cookies()).get("token")?.value
        const response = await http.get<BusinessFileResponseType>(`/data_source?page_size=${pageSize}&limit=${limit}`,{
            headers:{
                "Cookie": `token=${token}`
            }
        })

        return response.data.data

    } catch (error:unknown) {
        const message = checkAxiosEror(error)
        throw new Error(message)
    }
}

export const uploadBusinessFile = async (formData:FormData)=>{
    try {

        const token = (await cookies()).get("token")?.value
        const response = await http.post<BusinessFileUploadResponseType>("/data_source",formData,{
            headers:{
                "Cookie": `token=${token}`,
                "Content-Type":"multipart/form-data"
            },
        })

        revalidatePath("/business-data")

        return response.data.data

    } catch (error:unknown) {
        const message = checkAxiosEror(error)
        throw new Error(message)
    }
}