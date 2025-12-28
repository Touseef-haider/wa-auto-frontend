import { toast } from "react-toastify";

type Type = "error" | "info" | "success" | "warning" | "default"

export default function toastify(message:string,type:Type){
    toast(message,{
        type: type,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        position:"top-right"
    })
}