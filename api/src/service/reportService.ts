// api/src/service/reportService.ts
import { prisma } from "./prismaService.js";

export async function getSalesReportByMonth(params: {
  storeId?: number;
  year: number;
  month: number;
}) {
  const { storeId, year, month } = params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const where: Record<string, unknown> = {
    createdAt: { gte: startDate, lte: endDate },
    orderStatus: { in: ["ACCEPTED", "SHIPPED", "COMPLETED"] },
  };

  const orders = await prisma.order.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;

  return { totalRevenue, totalOrders, orders };
}

export async function getSalesReportByCategory(params: {
  storeId?: number;
  year: number;
  month: number;
}) {
  const { storeId, year, month } = params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const where: Record<string, unknown> = {
    createdAt: { gte: startDate, lte: endDate },
    orderStatus: { in: ["ACCEPTED", "SHIPPED", "COMPLETED"] },
  };

  const orders = await prisma.order.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });

  const categoryMap = new Map<
    string,
    { categoryId: number; categoryName: string; totalRevenue: number; totalOrders: number }
  >();

  for (const order of orders) {
    const catId = order.product.category?.id ?? 0;
    const catName = order.product.category?.name ?? "Uncategorized";
    const key = String(catId);

    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        categoryId: catId,
        categoryName: catName,
        totalRevenue: 0,
        totalOrders: 0,
      });
    }
    const entry = categoryMap.get(key)!;
    entry.totalRevenue += order.totalPrice;
    entry.totalOrders += 1;
  }

  return Array.from(categoryMap.values());
}

export async function getSalesReportByProduct(params: {
  storeId?: number;
  year: number;
  month: number;
}) {
  const { storeId, year, month } = params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const where: Record<string, unknown> = {
    createdAt: { gte: startDate, lte: endDate },
    orderStatus: { in: ["ACCEPTED", "SHIPPED", "COMPLETED"] },
  };

  const orders = await prisma.order.findMany({
    where,
    include: {
      product: { select: { id: true, name: true } },
    },
  });

  const productMap = new Map<
    number,
    { productId: number; productName: string; totalRevenue: number; totalQuantity: number }
  >();

  for (const order of orders) {
    const key = order.productId;
    if (!productMap.has(key)) {
      productMap.set(key, {
        productId: order.productId,
        productName: order.productName,
        totalRevenue: 0,
        totalQuantity: 0,
      });
    }
    const entry = productMap.get(key)!;
    entry.totalRevenue += order.totalPrice;
    entry.totalQuantity += order.quantity;
  }

  return Array.from(productMap.values());
}