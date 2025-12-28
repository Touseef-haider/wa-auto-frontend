
"use server"

import { http, checkAxiosEror } from "@/app/utils/http"
import { BusinessResponseType } from "../types"
import { cookies } from "next/headers"

export const getBusiness = async (): Promise<BusinessResponseType | undefined> => {
    try {
        const token = (await cookies()).get("token")?.value

        const response = await http.get<BusinessResponseType>("/business",{
            headers:{
                "Cookie": `token=${token}`
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (err: unknown) {
        const error = checkAxiosEror(err)
        throw new Error(error)
    }

}
