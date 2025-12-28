"use client"

import Button from "@/app/common/Button/Index"
import Input from "@/app/common/Input/Index"
import { RegisterFormData, registerSchema } from "@/app/features/(auth)/types/Index"
import { zodResolver } from "@hookform/resolvers/zod"
import { register as registerAction } from "@/app/features/(auth)/server-actions/Index"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import toastify from "@/app/utils/toastify"


const Register = () => {

    const router = useRouter()

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    })
    const handleFormSubmit = async (data: RegisterFormData) => {
        try {
            await registerAction(data)
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
                <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
            </div>

            <div className="space-y-4">
                <Input
                    type="phone"
                    placeholder="Enter phone number"
                    description="Business Phone"
                    error={errors.phone?.message}
                    {...register("phone")}
                />


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
                    href="/login"
                    className="text-sm text-primary hover:underline font-medium"
                >
                    Already have an account?
                </Link>
            </div>

            <Button type="submit" title="Register" />

        </form>
    )
}

export default Register