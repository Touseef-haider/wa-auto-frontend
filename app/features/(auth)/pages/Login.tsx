"use client"

import Button from "@/app/common/Button/Index"
import Input from "@/app/common/Input/Index"
import { login } from "@/app/features/(auth)/server-actions/Index"
import { LoginFormData, loginSchema } from "@/app/features/(auth)/types/Index"
import toastify from "@/app/utils/toastify"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"


const Login = () => {
    const router = useRouter();

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    })
    const handleFormSubmit = async (data: LoginFormData) => {
        try {
            await login(data)
            router.push("/")
        } catch (err: unknown) {
            if (err instanceof Error) {
                toastify(err.message, "error")
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-[90%]">

            <div className="text-center mb-8">
                <div className="text-4xl font-extrabold text-primary mb-2">WA</div>
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            </div>

            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Enter business name"
                    description="Business Name"
                    error={errors.business_name?.message}
                    {...register("business_name")}
                />

                <Input
                    type="password"
                    placeholder="Enter password"
                    description="Password"
                    error={errors.password?.message}
                    {...register("password")}
                />
            </div>

            <div className="text-right mt-2 mb-6">
                <Link
                    href="#"
                    className="text-sm text-primary hover:underline font-medium"
                >
                    Forgot Password?
                </Link>
            </div>

            <Button type="submit" title="Log In" />

            <div className="text-right mt-2 mb-6">
                <Link
                    href="/register"
                    className="text-sm text-primary hover:underline font-medium"
                >
                    Don&apos;t have account?
                </Link>
            </div>


        </form>
    )
}

export default Login