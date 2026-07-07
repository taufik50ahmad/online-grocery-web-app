// api/src/controller/categoryController.ts
import type { Request, Response } from "express";
import { z } from "zod";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../service/categoryService.js";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export async function getCategoryList(req: Request, res: Response) {
  try {
    const { search, page, limit } = req.query;
    const result = await getCategories(
      search as string,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch categories",
    });
  }
}

export async function getCategoryDetail(req: Request, res: Response) {
  try {
    const category = await getCategoryById(Number(req.params.id));
    return res.json({ category });
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Category not found",
    });
  }
}

export async function createCategoryData(req: Request, res: Response) {
  try {
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }
    const category = await createCategory({
      name: validation.data.name,
      imageUrl: validation.data.imageUrl || undefined,
    });
    return res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create category",
    });
  }
}

export async function updateCategoryData(req: Request, res: Response) {
  try {
    const validation = categorySchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }
    const category = await updateCategory(Number(req.params.id), {
      name: validation.data.name,
      imageUrl: validation.data.imageUrl || undefined,
    });
    return res.json({ message: "Category updated successfully", category });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update category",
    });
  }
}

export async function deleteCategoryData(req: Request, res: Response) {
  try {
    await deleteCategory(Number(req.params.id));
    return res.json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to delete category",
    });
  }
}
