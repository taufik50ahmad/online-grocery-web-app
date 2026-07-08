// api/src/controller/discountController.ts
import type { Request, Response } from "express";
import { z } from "zod";
import {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from "../service/discountService.js";

const discountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "NOMINAL", "BOGO"]),
  scope: z.enum(["PRODUCT", "TRANSACTION", "SHIPPING"]),
  value: z.number().int().min(0, "Value must be >= 0"),
  minValue: z.number().int().optional(),
  maxValue: z.number().int().optional(),
  productId: z.number().int().optional(),
  storeId: z.number().int().positive("Store is required"),
  startDate: z.string(),
  endDate: z.string(),
});

export async function getDiscountList(req: Request, res: Response) {
  try {
    const { storeId, productId, search, isActive, page, limit } = req.query;
    const result = await getDiscounts({
      ...(storeId && { storeId: Number(storeId) }),
      ...(productId && { productId: Number(productId) }),
      ...(search && { search: search as string }),
      ...(isActive !== undefined && { isActive: isActive === "true" }),
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch discounts",
    });
  }
}

export async function getDiscountDetail(req: Request, res: Response) {
  try {
    const discount = await getDiscountById(Number(req.params.id));
    return res.json({ discount });
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Discount not found",
    });
  }
}

export async function createDiscountData(req: Request, res: Response) {
  try {
    const validation = discountSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }
    const userId = (req as any).user?.id;
    const data = validation.data;
    const discount = await createDiscount({
      name: data.name,
      type: data.type,
      scope: data.scope,
      value: data.value,
      storeId: data.storeId,
      startDate: data.startDate,
      endDate: data.endDate,
      ...(data.description && { description: data.description }),
      ...(data.minValue !== undefined && { minValue: data.minValue }),
      ...(data.maxValue !== undefined && { maxValue: data.maxValue }),
      ...(data.productId !== undefined && { productId: data.productId }),
      ...(userId && { createdById: userId }),
    });
    return res.status(201).json({ message: "Discount created successfully", discount });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create discount",
    });
  }
}

export async function updateDiscountData(req: Request, res: Response) {
  try {
    const validation = discountSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }
    const data = validation.data;
    const updatePayload: Record<string, unknown> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.type !== undefined) updatePayload.type = data.type;
    if (data.scope !== undefined) updatePayload.scope = data.scope;
    if (data.value !== undefined) updatePayload.value = data.value;
    if (data.minValue !== undefined) updatePayload.minValue = data.minValue;
    if (data.maxValue !== undefined) updatePayload.maxValue = data.maxValue;
    if (data.productId !== undefined) updatePayload.productId = data.productId;
    if (data.storeId !== undefined) updatePayload.storeId = data.storeId;
    if (data.startDate !== undefined) updatePayload.startDate = data.startDate;
    if (data.endDate !== undefined) updatePayload.endDate = data.endDate;

    const discount = await updateDiscount(Number(req.params.id), updatePayload as any);
    return res.json({ message: "Discount updated successfully", discount });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update discount",
    });
  }
}

export async function deleteDiscountData(req: Request, res: Response) {
  try {
    await deleteDiscount(Number(req.params.id));
    return res.json({ message: "Discount deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to delete discount",
    });
  }
}

export async function toggleDiscountStatusData(req: Request, res: Response) {
  try {
    const discount = await toggleDiscountStatus(Number(req.params.id));
    return res.json({ message: "Discount status updated", discount });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update status",
    });
  }
}