// api/src/controller/productController.ts
import type { Request, Response } from "express";
import { z } from "zod";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../service/productService.js";

const imageSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  isPrimary: z.boolean().optional(),
  order: z.number().int().optional(),
});

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().int().min(1, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  unit: z.string().optional(),
  categoryId: z.number().int().optional(),
  images: z.array(imageSchema).optional(),
});

export async function getProductList(req: Request, res: Response) {
  try {
    const { search, categoryId, page, limit, isActive } = req.query;
    const result = await getProducts({
      search: search as string,
      categoryId: categoryId ? Number(categoryId) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch products",
    });
  }
}

export async function getProductDetail(req: Request, res: Response) {
  try {
    const product = await getProductById(Number(req.params.id));
    return res.json({ product });
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Product not found",
    });
  }
}

export async function createProductData(req: Request, res: Response) {
  try {
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }
    const product = await createProduct(validation.data);
    return res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create product",
    });
  }
}

export async function updateProductData(req: Request, res: Response) {
  try {
    const validation = productSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }
    const product = await updateProduct(Number(req.params.id), validation.data);
    return res.json({ message: "Product updated successfully", product });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update product",
    });
  }
}

export async function deleteProductData(req: Request, res: Response) {
  try {
    await deleteProduct(Number(req.params.id));
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to delete product",
    });
  }
}

export async function toggleProductStatusData(req: Request, res: Response) {
  try {
    const product = await toggleProductStatus(Number(req.params.id));
    return res.json({ message: "Product status updated", product });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update status",
    });
  }
}
