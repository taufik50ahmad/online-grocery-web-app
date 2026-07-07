// api/src/service/discountService.ts
import { prisma } from "./prismaService.js";

export interface DiscountInput {
  name: string;
  description?: string;
  type: "PERCENTAGE" | "NOMINAL" | "BOGO";
  scope: "PRODUCT" | "TRANSACTION" | "SHIPPING";
  value: number;
  minValue?: number;
  maxValue?: number;
  productId?: number;
  storeId: number;
  isActive?: boolean;
  startDate: string;
  endDate: string;
  createdById?: number;
}

export async function getDiscounts(params: {
  storeId?: number;
  productId?: number;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  const { storeId, productId, search, isActive, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (storeId) where.storeId = storeId;
  if (productId) where.productId = productId;
  if (isActive !== undefined) where.isActive = isActive;
  if (search) where.name = { contains: search, mode: "insensitive" };

  const [discounts, total] = await Promise.all([
    prisma.discount.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true } },
        store: { select: { id: true, name: true } },
      },
    }),
    prisma.discount.count({ where }),
  ]);

  return { discounts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getDiscountById(id: number) {
  const discount = await prisma.discount.findUnique({
    where: { id },
    include: {
      product: { select: { id: true, name: true } },
      store: { select: { id: true, name: true } },
    },
  });
  if (!discount) throw new Error("Discount not found");
  return discount;
}

export async function createDiscount(data: DiscountInput) {
  const store = await prisma.store.findUnique({ where: { id: data.storeId } });
  if (!store) throw new Error("Store not found");

  if (data.productId) {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw new Error("Product not found");
  }

  if (data.type === "PERCENTAGE" && (data.value < 0 || data.value > 100)) {
    throw new Error("Percentage value must be between 0 and 100");
  }

  if (data.type === "NOMINAL" && data.value <= 0) {
    throw new Error("Nominal value must be greater than 0");
  }

  return prisma.discount.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      scope: data.scope,
      value: data.value,
      minValue: data.minValue,
      maxValue: data.maxValue,
      productId: data.productId,
      storeId: data.storeId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      createdById: data.createdById,
    },
    include: {
      product: { select: { id: true, name: true } },
      store: { select: { id: true, name: true } },
    },
  });
}

export async function updateDiscount(id: number, data: Partial<DiscountInput>) {
  const discount = await prisma.discount.findUnique({ where: { id } });
  if (!discount) throw new Error("Discount not found");

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.scope !== undefined) updateData.scope = data.scope;
  if (data.value !== undefined) updateData.value = data.value;
  if (data.minValue !== undefined) updateData.minValue = data.minValue;
  if (data.maxValue !== undefined) updateData.maxValue = data.maxValue;
  if (data.productId !== undefined) updateData.productId = data.productId;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);

  return prisma.discount.update({
    where: { id },
    data: updateData,
    include: {
      product: { select: { id: true, name: true } },
      store: { select: { id: true, name: true } },
    },
  });
}

export async function deleteDiscount(id: number) {
  const discount = await prisma.discount.findUnique({ where: { id } });
  if (!discount) throw new Error("Discount not found");
  return prisma.discount.delete({ where: { id } });
}

export async function toggleDiscountStatus(id: number) {
  const discount = await prisma.discount.findUnique({ where: { id } });
  if (!discount) throw new Error("Discount not found");
  return prisma.discount.update({
    where: { id },
    data: { isActive: !discount.isActive },
  });
}