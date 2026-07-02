import type { Request, Response } from "express";
import { z } from "zod";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../service/productService.js";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().optional(),
});

const updateProductSchema = productSchema.partial();

export async function getProductList(_req: Request, res: Response) {
  try {
    const products = await getProducts();

    return res.json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Gagal mengambil produk",
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

    return res.status(201).json({
      message: "Product berhasil dibuat",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal membuat produk",
    });
  }
}

export async function updateProductData(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);

    const validation = updateProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }

    const product = await updateProduct(productId, validation.data);

    return res.json({
      message: "Product berhasil diperbarui",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal update produk",
    });
  }
}

export async function deleteProductData(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);

    await deleteProduct(productId);

    return res.json({
      message: "Product berhasil dihapus",
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal hapus produk",
    });
  }
}
