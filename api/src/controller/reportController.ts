// api/src/controller/reportController.ts
import type { Request, Response } from "express";
import {
  getSalesReportByMonth,
  getSalesReportByCategory,
  getSalesReportByProduct,
} from "../service/reportService.js";
import { getStockSummary, getStockJournals } from "../service/stockJournalService.js";

export async function getSalesReport(req: Request, res: Response) {
  try {
    const { storeId, year, month } = req.query;
    const y = year ? Number(year) : new Date().getFullYear();
    const m = month ? Number(month) : new Date().getMonth() + 1;

    const result = await getSalesReportByMonth({
      ...(storeId && { storeId: Number(storeId) }),
      year: y,
      month: m,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch sales report",
    });
  }
}

export async function getSalesByCategoryReport(req: Request, res: Response) {
  try {
    const { storeId, year, month } = req.query;
    const y = year ? Number(year) : new Date().getFullYear();
    const m = month ? Number(month) : new Date().getMonth() + 1;

    const result = await getSalesReportByCategory({
      ...(storeId && { storeId: Number(storeId) }),
      year: y,
      month: m,
    });
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch report",
    });
  }
}

export async function getSalesByProductReport(req: Request, res: Response) {
  try {
    const { storeId, year, month } = req.query;
    const y = year ? Number(year) : new Date().getFullYear();
    const m = month ? Number(month) : new Date().getMonth() + 1;

    const result = await getSalesReportByProduct({
      ...(storeId && { storeId: Number(storeId) }),
      year: y,
      month: m,
    });
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch report",
    });
  }
}

export async function getStockSummaryReport(req: Request, res: Response) {
  try {
    const { storeId, year, month } = req.query;
    const y = year ? Number(year) : new Date().getFullYear();
    const m = month ? Number(month) : new Date().getMonth() + 1;

    const result = await getStockSummary({
      ...(storeId && { storeId: Number(storeId) }),
      year: y,
      month: m,
    });
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch stock summary",
    });
  }
}

export async function getStockDetailReport(req: Request, res: Response) {
  try {
    const { storeId, productId, year, month, page, limit } = req.query;
    const y = year ? Number(year) : new Date().getFullYear();
    const m = month ? Number(month) : new Date().getMonth() + 1;
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const result = await getStockJournals({
      ...(storeId && { storeId: Number(storeId) }),
      ...(productId && { productId: Number(productId) }),
      startDate,
      endDate,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch stock detail",
    });
  }
}