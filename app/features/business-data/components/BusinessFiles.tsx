"use client";

import DataTable from "@/app/common/Tables";
import { ColumnDef } from "@tanstack/react-table";
import { BusinessFileResponseType, uploadBusinessFile, type BusinessFile } from "@/app/features/business-data/server-actions/files"
import Button from "@/app/common/Button/Index";
import Dialog from "@/app/common/Dialog/Index";
import { useCallback, useEffect, useState } from "react";
import Input from "@/app/common/Input/Index";
import { useForm } from "react-hook-form";
import { BusinessFileUpload, businessFileSchema } from "@/app/features/business-data/types/Index"
import { zodResolver } from "@hookform/resolvers/zod";
import toastify from "@/app/utils/toastify";
import { checkAxiosEror, http } from "@/app/utils/http";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/hooks/use-debounce";


const BusinessFiles = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState<BusinessFile[]>([])
  const params = useSearchParams()
  const pageSize = Number(params.get("pageSize") || 1)
  const pageLimit = Number(params.get("limit") || 10)
  const [limit, setLimit] = useState(pageLimit)
  const [page, setPage] = useState(pageSize)
  const [total, setTotal] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [search, setSearch] = useState("")
  const debounceSearch = useDebounce(search, 500)
  const [loading, setLoading] = useState(true)
  const router = useRouter()


  const columns: ColumnDef<BusinessFile>[] = [
    { accessorKey: "_id", header: "ID" },
    { accessorKey: "filename", header: "File Name" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const file = row.original;


        return (
          <div className="flex gap-2">
            <Button
              onClick={()=>router.push(`/business-data/${file.filename}/chat`)}
              className="px-2 py-1 text-sm"
              title="Chat/Test with file"
              type="button"
              
            />
          </div>
        );
      },
    },
  ];


  const { reset, handleSubmit, setValue, watch } = useForm({
    resolver: zodResolver(businessFileSchema)
  })

  const handleAddFile = async (data: BusinessFileUpload) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", data.file)

    try {

      await uploadBusinessFile(formData)

      toastify("file uploaded", "success")

      await fetchBusinessFiles()

    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error)
        toastify(error.message, "error")
    } finally {
      reset()
      setIsOpen(false)
      setIsUploading(false)
    }

  }


  const fetchBusinessFiles = useCallback(async () => {
    try {
      const response = await http.get<BusinessFileResponseType>(
        `/data_source?page=${page}&limit=${limit}&search=${encodeURIComponent(debounceSearch)}`,
        { withCredentials: true }
      );

      setFiles(response.data.data.result);
      setTotal(response.data.data.total)
    } catch (error: unknown) {
      const message = checkAxiosEror(error);
      toastify(message, "error");
    } finally {
      setLoading(false)
    }
  }, [page, limit, debounceSearch]);


  useEffect(() => {
    fetchBusinessFiles()
  }, [fetchBusinessFiles])

  const selectedFile = watch("file");

  const handleSearch = (value: string) => {
    setSearch(value)
  }



  useEffect(()=>{
    if(!isOpen){
      setIsUploading(false)
    }
  },[isOpen])



  return (
    <>

    
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          reset()
        }}
        cancelText="Cancel"
        disabled={isUploading}
        confirmText={isUploading ? "Adding..." : "Add"}
        onConfirm={handleSubmit(handleAddFile)}
        title="Business Files"
      >
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected File: {selectedFile.name}
          </p>
        )}

        <Input
          name="business-file"
          id="business-file"
          type="file"
          disabled={isUploading}
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.length) {
              setValue("file", e.target.files?.[0])
            }
          }}
        />

        <Button
          title="Upload file"
          type="button"
          className="px-2 py-2"
          onClick={() => {
            const businessFile = document.getElementById("business-file")
            businessFile?.click()
          }}
        />

      </Dialog>
      <div className="flex justify-end mt-6">
        <Button
          title="Add File"
          type="button"
          className="py-2 px-4"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <div className="mt-10">

        <DataTable<BusinessFile>
          data={files}
          columns={columns}
          total={total}
          searchPlaceholder='Search by filename'
          pageIndex={page - 1}
          pageSize={limit}
          loading={loading}
          search={search}
          onSearchChange={handleSearch}
          onPageChange={(index) => setPage(index + 1)}
          onPageSizeChange={(newLimit) => {
            setPage(1);
            setLimit(newLimit);
          }}
        />
      </div>
    </>

  );
};

export default BusinessFiles;
