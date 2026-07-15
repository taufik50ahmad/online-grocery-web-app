// api/src/service/productService.ts
import { prisma } from "./prismaService.js";

function generateSlug(name: string): string {
  return (
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") +
    "-" + Date.now()
  );
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit?: string;
  categoryId?: number;
  images?: { imageUrl: string; isPrimary?: boolean; order?: number }[];
}

export async function getProducts(params: {
  search?: string;
  categoryId?: number;
  page?: number;
  limit?: number;
  isActive?: boolean;
}) {
  const { search, categoryId, page = 1, limit = 10, isActive } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (categoryId) where.categoryId = categoryId;
  if (isActive !== undefined) where.isActive = isActive;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });
  if (!product) throw new Error("Product not found");
  return product;
}

export async function createProduct(data: ProductInput) {
  const existing = await prisma.product.findFirst({
    where: { name: { equals: data.name, mode: "insensitive" } },
  });
  if (existing) {
    throw new Error("Product with this name already exists");
  }

  const slug = generateSlug(data.name);
  return prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      unit: data.unit ?? "pcs",
      categoryId: data.categoryId,
      images: data.images?.length
        ? { create: data.images.map((img, i) => ({ ...img, order: img.order ?? i })) }
        : undefined,
    },
    include: {
      category: { select: { id: true, name: true } },
      images: true,
    },
  });
}

export async function updateProduct(id: number, data: Partial<ProductInput>) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");

  if (data.name) {
    const conflict = await prisma.product.findFirst({
      where: {
        name: { equals: data.name, mode: "insensitive" },
        NOT: { id },
      },
    });
    if (conflict) {
      throw new Error("Product with this name already exists");
    }
  }

  const { images, ...rest } = data;

  return prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(images !== undefined && {
        images: {
          deleteMany: {},
          create: images.map((img, i) => ({ ...img, order: img.order ?? i })),
        },
      }),
    },
    include: {
      category: { select: { id: true, name: true } },
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function deleteProduct(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");
  return prisma.product.delete({ where: { id } });
}

export async function toggleProductStatus(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");
  return prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });
}
