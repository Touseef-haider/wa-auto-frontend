import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  currency: z.string().default("PKR").optional(),
  images: z.any().optional(),
  status: z.enum(["active", "draft", "out_of_stock"]).optional(),
});

export type Product = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  status?: "active" | "draft" | "out_of_stock";
};


export type ProductCreate = z.infer<typeof productSchema>;
