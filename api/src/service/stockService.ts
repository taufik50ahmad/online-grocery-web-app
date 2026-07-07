// api/src/service/stockService.ts
import { prisma } from "./prismaService.js";

export interface StockAdjustmentInput {
  productId: number;
  storeId: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  note?: string;
  userId?: number;
}

export async function getStocks(params: {
  storeId?: number;
  productId?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { storeId, productId, search, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (storeId) where.storeId = storeId;
  if (productId) where.productId = productId;
  if (search) {
    where.product = { name: { contains: search, mode: "insensitive" } };
  }

  const [stocks, total] = await Promise.all([
    prisma.stock.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        product: { select: { id: true, name: true, unit: true } },
        store: { select: { id: true, name: true } },
      },
    }),
    prisma.stock.count({ where }),
  ]);

  return { stocks, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getStockById(id: number) {
  const stock = await prisma.stock.findUnique({
    where: { id },
    include: {
      product: { select: { id: true, name: true, unit: true } },
      store: { select: { id: true, name: true } },
    },
  });
  if (!stock) throw new Error("Stock not found");
  return stock;
}

export async function adjustStock(data: StockAdjustmentInput) {
  const { productId, storeId, type, quantity, note, userId } = data;

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new Error("Store not found");

  return prisma.$transaction(async (tx) => {
    let stock = await tx.stock.findUnique({
      where: { productId_storeId: { productId, storeId } },
    });

    if (!stock) {
      stock = await tx.stock.create({
        data: { productId, storeId, quantity: 0 },
      });
    }

    let newQuantity = stock.quantity;
    if (type === "IN") {
      newQuantity = stock.quantity + quantity;
    } else if (type === "OUT") {
      if (stock.quantity < quantity) {
        throw new Error("Insufficient stock");
      }
      newQuantity = stock.quantity - quantity;
    } else if (type === "ADJUSTMENT") {
      newQuantity = quantity;
    }

    const updatedStock = await tx.stock.update({
      where: { id: stock.id },
      data: { quantity: newQuantity },
    });

    const journal = await tx.stockJournal.create({
      data: {
        stockId: stock.id,
        productId,
        storeId,
        type,
        quantity: type === "ADJUSTMENT" ? newQuantity : quantity,
        note,
        userId,
      },
    });

    return { stock: updatedStock, journal };
  });
}