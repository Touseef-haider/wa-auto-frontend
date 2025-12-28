"use client"

import Input from "@/app/common/Input/Index"
import { BusinessPatchResponseType, businessProfileFormData, businessProfileSchema, BusinessType } from "../types"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toastify from "@/app/utils/toastify"
import { checkAxiosEror, http } from "@/app/utils/http"
import Button from "@/app/common/Button/Index"
import { useState } from "react"
import { SERVER_URL } from "@/app/utils/constant"


const Profile = ({ business }: { business: BusinessType }) => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [logoPreview, setLogoPreview] = useState<File | null>(null)


    const { handleSubmit, register, formState: { errors }, control } = useForm({
        resolver: zodResolver(businessProfileSchema),
        defaultValues: {
            business_name: business.business_name || "",
            phone: business.phone,
            email: business.email || "",
            addresses: business.addresses || [],
            website: business.website || ""
        }
    })


    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogoPreview(file)
        }
    }


    const handleBusinessSubmit = async (data: businessProfileFormData) => {
        try {
            setIsUpdating(true)

            const newFormData = new FormData()
            newFormData.append("business_name",data.business_name)
            newFormData.append("phone",data.phone)
            newFormData.append("email",data.email)
            newFormData.append("addresses",JSON.stringify(data.addresses))
            newFormData.append("website",data.website)
            if(logoPreview){
                newFormData.append("file",logoPreview)
            }
            const response = await http.patch<BusinessPatchResponseType>("/business", newFormData, {
                withCredentials: true,
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })

            if (response.status == 200) {
                toastify(response.data.message, "success")
            }

        } catch (err: unknown) {
            const message = checkAxiosEror(err)
            toastify(message, "error")
        } finally {
            setIsUpdating(false)
        }
    }


    const { fields: addresses, append, remove } = useFieldArray({
        control,
        name:"addresses" // ignore
    })

    const handleAddresses = () => {
        append("")
    }


    return (
        <form
            onSubmit={handleSubmit(handleBusinessSubmit)}
            className="max-w-3xl bg-white rounded-xl border border-gray-200 p-6 mt-6 shadow-sm"
        >
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                Business Profile
            </h1>


            {/* Logo Section */}
            <div className="mt-6 mb-6">
                <h2 className="text-lg font-medium text-gray-700 mb-6">Logo</h2>
                <div className="flex items-center gap-4">
                    {(logoPreview || business.logo) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logoPreview ? URL.createObjectURL(logoPreview) : business.logo ? SERVER_URL + "/uploads/" + business.logo : ""}
                            width={400}
                            height={400}
                            alt="Logo Preview"
                            className="w-20 h-20 object-cover rounded border border-gray-300"
                        />
                    )}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="block cursor-pointer text-sm text-gray-600"
                    />
                </div>
            </div>


            <h2 className="text-lg font-medium text-gray-700 mb-6">Update your business information and contact details</h2>
                
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    type="text"
                    error={errors.business_name?.message}
                    placeholder="Business Name"
                    {...register("business_name")}
                />
                <Input
                    type="number"
                    placeholder="Business Phone"
                    error={errors.phone?.message}
                    {...register("phone")}
                />
                <Input
                    type="email"
                    placeholder="Business Email"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Input
                    type="text"
                    placeholder="Business Website"
                    error={errors.website?.message}
                    {...register("website")}
                />
            </div>

            {/* Addresses Section */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-medium text-gray-700 mv-6">Addresses</h2>
                    <Button
                        title="Add Address"
                        type="button"
                        className="px-3 py-1 text-sm"
                        onClick={handleAddresses}
                    />
                </div>

                <div className="space-y-3">
                    {addresses.map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder={`Business Address ${index + 1}`}
                                error={errors.addresses?.[index]?.message}
                                {...register(`addresses.${index}`)}
                            />
                            <Button
                                type="button"
                                title="Remove"
                                onClick={() => remove(index)}
                                className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                            />
                        </div>
                    ))}
                </div>
            </div>


            <div className="flex justify-end mt-6">
                <Button
                    title={isUpdating ? "Updating profile" : "Save Changes"}
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 text-sm font-medium"
                />
            </div>
        </form>

    )
}

export default Profile