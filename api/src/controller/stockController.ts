// api/src/controller/stockController.ts
import type { Request, Response } from "express";
import { z } from "zod";
import { getStocks, getStockById, adjustStock } from "../service/stockService.js";
import { getStockJournals } from "../service/stockJournalService.js";

const adjustmentSchema = z.object({
  productId: z.number().int().positive(),
  storeId: z.number().int().positive(),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
});

export async function getStockList(req: Request, res: Response) {
  try {
    const { storeId, productId, search, page, limit } = req.query;
    const result = await getStocks({
      ...(storeId && { storeId: Number(storeId) }),
      ...(productId && { productId: Number(productId) }),
      ...(search && { search: search as string }),
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch stocks",
    });
  }
}

export async function getStockDetail(req: Request, res: Response) {
  try {
    const stock = await getStockById(Number(req.params.id));
    return res.json({ stock });
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Stock not found",
    });
  }
}

export async function createStockAdjustment(req: Request, res: Response) {
  try {
    const validation = adjustmentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }
    const userId = (req as any).user?.id;
    const data = validation.data;
    const result = await adjustStock({
      productId: data.productId,
      storeId: data.storeId,
      type: data.type,
      quantity: data.quantity,
      ...(data.note && { note: data.note }),
      ...(userId && { userId }),
    });
    return res.status(201).json({ message: "Stock adjusted successfully", ...result });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to adjust stock",
    });
  }
}

export async function getJournalList(req: Request, res: Response) {
  try {
    const { storeId, productId, startDate, endDate, page, limit } = req.query;
    const result = await getStockJournals({
      ...(storeId && { storeId: Number(storeId) }),
      ...(productId && { productId: Number(productId) }),
      ...(startDate && { startDate: new Date(startDate as string) }),
      ...(endDate && { endDate: new Date(endDate as string) }),
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch journals",
    });
  }
}