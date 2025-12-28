
"use server"

import { http, checkAxiosEror } from "@/app/utils/http"
import { DashboardAnalyticResponseType } from "../types/index"
import { cookies } from "next/headers"

export const getAnaylytics = async (): Promise<DashboardAnalyticResponseType | undefined> => {
    try {
        const token = (await cookies()).get("token")?.value

        const response = await http.get<DashboardAnalyticResponseType>("/dashboard",{
            headers:{
                "Cookie": `token=${token}`,
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
