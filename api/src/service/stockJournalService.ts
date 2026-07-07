// api/src/service/stockJournalService.ts
import { prisma } from "./prismaService.js";

export async function getStockJournals(params: {
  storeId?: number;
  productId?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  const { storeId, productId, startDate, endDate, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (storeId) where.storeId = storeId;
  if (productId) where.productId = productId;
  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;
    where.createdAt = dateFilter;
  }

  const [journals, total] = await Promise.all([
    prisma.stockJournal.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true, unit: true } },
        store: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    }),
    prisma.stockJournal.count({ where }),
  ]);

  return { journals, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getStockSummary(params: {
  storeId?: number;
  year: number;
  month: number;
}) {
  const { storeId, year, month } = params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const where: Record<string, unknown> = {
    createdAt: { gte: startDate, lte: endDate },
  };
  if (storeId) where.storeId = storeId;

  const journals = await prisma.stockJournal.findMany({
    where,
    include: { product: { select: { id: true, name: true, unit: true } } },
  });

  const summary = new Map<
    number,
    {
      productId: number;
      productName: string;
      unit: string;
      totalIn: number;
      totalOut: number;
      finalStock: number;
    }
  >();

  for (const journal of journals) {
    const key = journal.productId;
    if (!summary.has(key)) {
      const currentStock = await prisma.stock.findUnique({
        where: {
          productId_storeId: { productId: journal.productId, storeId: journal.storeId },
        },
      });
      summary.set(key, {
        productId: journal.productId,
        productName: journal.product.name,
        unit: journal.product.unit,
        totalIn: 0,
        totalOut: 0,
        finalStock: currentStock?.quantity ?? 0,
      });
    }
    const entry = summary.get(key)!;
    if (journal.type === "IN") entry.totalIn += journal.quantity;
    else if (journal.type === "OUT") entry.totalOut += journal.quantity;
  }

  return Array.from(summary.values());
}