"use client";

import Image from "next/image";
import DataTable from "@/app/common/Tables";
import { ColumnDef } from "@tanstack/react-table";
import Button from "@/app/common/Button/Index";
import Dialog from "@/app/common/Dialog/Index";
import { useCallback, useEffect, useState } from "react";
import Input from "@/app/common/Input/Index";
import { useForm, Controller } from "react-hook-form";
import { Product, ProductCreate, productSchema } from "@/app/features/products/types/Index";
import { zodResolver } from "@hookform/resolvers/zod";
import toastify from "@/app/utils/toastify";
import { checkAxiosEror, http } from "@/app/utils/http";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/hooks/use-debounce";
import Select from "@/app/common/Select/Index";
import { SERVER_URL } from "@/app/utils/constant";

const Products = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const params = useSearchParams();
  const pageSize = Number(params.get("pageSize") || 1);
  const pageLimit = Number(params.get("limit") || 10);
  const [limit, setLimit] = useState(pageLimit);
  const [page, setPage] = useState(pageSize);
  const [total, setTotal] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const [loading, setLoading] = useState(true);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [editingProductId, setEditingProductId] = useState<string>("");
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { control, register, setValue, reset, handleSubmit, watch } = useForm<ProductCreate>({
    resolver: zodResolver(productSchema),
  });

  const images = watch("images"); // New uploaded images

  const fetchProducts = useCallback(async () => {
    try {
      const response = await http.get(`/products?page=${page}&limit=${limit}&search=${debounceSearch}`, { withCredentials: true });
      setProducts(response.data.data.result);
      setTotal(response.data.data.total);
    } catch (err) {
      toastify(checkAxiosEror(err), "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debounceSearch]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (value: string) => setSearch(value);

  const handleAddProduct = async (data: ProductCreate) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description ?? "");
      formData.append("price", String(data.price) ?? "");
      formData.append("currency", data.currency ?? "PKR");
      formData.append("status", data.status ?? "active");
      formData.append("existing_images", JSON.stringify(existingImages));
      formData.append("removed_images", JSON.stringify(removedImages));


      if (data.images) {
        Array.from(data.images as FileList).forEach(file => formData.append("images", file));
      }

      if (editingProductId) {
        await http.put(`/products/${editingProductId}`, formData, { withCredentials: true , headers: { "Content-Type": "multipart/form-data" }});
        toastify("Product updated", "success");
      } else {
        await http.post("/products", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        toastify("Product added", "success");
      }

      fetchProducts();
      setIsOpen(false);
      reset();
      setEditingProductId("");
      setExistingImages([]);
    } catch (err) {
      toastify(checkAxiosEror(err), "error");
    } finally {
      setIsUploading(false);
    }
  };

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "price", header: "Price", cell: ({ row }) => `${row.original.currency} ${row.original.price}` },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

        const handleDelete = async () => {
          if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;
          try {
            await http.delete(`/products/${product._id}`, { withCredentials: true });
            toastify("Product deleted successfully", "success");
            fetchProducts();
          } catch (err) {
            toastify(checkAxiosEror(err), "error");
          }
        };

        const handleEdit = () => {
          setEditingProductId(product._id);
          setIsOpen(true);
          setValue("name", product.name);
          setValue("description", product.description);
          setValue("price", product.price);
          setValue("currency", product.currency);
          setValue("status", product.status);

          setExistingImages(product.images ?? []);
        };

        return (
          <div className="flex gap-2">
            <Button title="Edit" type="button" className="px-2 py-1 text-sm" onClick={handleEdit} />
            <Button title="Delete" type="button" className="px-2 py-1 text-sm bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete} />
          </div>
        );
      },
    },
  ];

  const removeExistingImage = (url: string) => {
    setRemovedImages(prev => [...prev, url]);
    setExistingImages(prev => prev.filter(u => u !== url));
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); reset(); setEditingProductId(""); setExistingImages([]); }}
        confirmText={isUploading ? (editingProductId ? "Updating..." : "Adding...") : (editingProductId ? "Update Product" : "Add Product")}
        onConfirm={handleSubmit(handleAddProduct)}
        title={editingProductId ? "Edit Product" : "Add Product"}
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="Product Name" {...register("name")} className="mb-4 w-full" placeholder="Wireless Headphones" />
          <Input label="Description" {...register("description")} className="mb-4 w-full" placeholder="Description" />
          <Input label="Price" type="number" {...register("price", { valueAsNumber: true })} className="mb-4 w-full" placeholder="99.99" />
          <Input label="Currency" {...register("currency")} className="mb-4 w-full" placeholder="Currency" defaultValue="PKR" />
          <Controller
            name="status"
            control={control}
            defaultValue="active"
            render={({ field }) => (
              <Select
                options={[
                  { label: "Active", value: "active" },
                  { label: "Draft", value: "draft" },
                  { label: "Out of Stock", value: "out_of_stock" },
                ]}
                className="mb-4 w-full"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Input label="Images" type="file" multiple {...register("images")} className="mb-4 w-full" />
        </div>

        {existingImages.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 font-medium">Existing Images:</h3>
            <div className="flex gap-4 flex-wrap">
              {existingImages.map((url, index) => (
                <div key={index} className="w-24 h-24 relative">
                  <img
                    src={SERVER_URL + "/uploads/" + url}
                    alt={`Existing Image ${index + 1}`}
                    className="m-2 border border-green-700 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => removeExistingImage(url)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {images && (images as FileList).length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 font-medium">New Images:</h3>
            <div className="flex gap-4 flex-wrap">
              {Array.from(images as FileList).map((file, index) => (
                <div key={index} className="w-24 h-24 relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className="m-2 border border-green-700 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>

      <div className="flex justify-end mt-6">
        <Button title="Add Product" type="button" className="py-2 px-4" onClick={() => setIsOpen(true)} />
      </div>

      <div className="mt-10">
        <DataTable<Product>
          data={products}
          columns={columns}
          total={total}
          searchPlaceholder="Search by filename"
          pageIndex={page - 1}
          pageSize={limit}
          loading={loading}
          search={search}
          onSearchChange={handleSearch}
          onPageChange={(index) => setPage(index + 1)}
          onPageSizeChange={(newLimit) => { setPage(1); setLimit(newLimit); }}
        />
      </div>
    </>
  );
};

export default Products;
