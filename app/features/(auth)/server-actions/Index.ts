
"use server"

import { LoginFormData, RegisterFormData } from "@/app/features/(auth)/types/Index"
import { http, checkAxiosEror } from "@/app/utils/http"
import { cookies } from "next/headers"

export type LoginResponseType = {
    message: string,
    data: {
        token: string
    }
}

export type RegisterResponseType = {
    message: string,
    data: {
        user_id: string,
        business_id: string,
        token: string
    }
}


export const login = async (data: LoginFormData): Promise<LoginResponseType | undefined> => {
    try {
        const response = await http.post<LoginResponseType>("/login", data)
        if (response.status === 200) {
            (await cookies()).set("token",response.data.data.token)
            return response.data
        }
    } catch (err: unknown) {
        console.log("came here")
        const error = checkAxiosEror(err)
        throw new Error(error)
    }

}


export const register = async (data: RegisterFormData): Promise<RegisterResponseType | undefined> => {
    try {
        const response = await http.post<RegisterResponseType>("/register", data)
        if (response.status === 200) {
            (await cookies()).set("token",response.data.data.token)
            return response.data
        }
    } catch (err: unknown) {
        const error = checkAxiosEror(err)
        throw new Error(error)
    }

}