

import axios from "axios";
import { SERVER_URL } from "./constant";

const http = axios.create({
    headers:{
        "Content-Type":"application/json"
    },
    baseURL:`${SERVER_URL}/api`
})


type ErrorData = {
    message?:string,
    error?: string,
    detail?:string,
    [key: string]: unknown
}

function checkAxiosEror(err:unknown):string{
    if(err instanceof axios.AxiosError){
        const data =  err.response?.data as ErrorData || undefined
        if (!data){
            return "unknow error"
        }
        return (data.detail || data.error || data.message || JSON.stringify(data) )
    }
    return "unknown error"
}

export {http,checkAxiosEror}