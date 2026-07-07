// api/src/service/categoryService.ts
import { prisma } from "./prismaService.js";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export interface CategoryInput {
  name: string;
  imageUrl?: string;
}

export async function getCategories(search?: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) throw new Error("Category not found");
  return category;
}

export async function createCategory(data: CategoryInput) {
  const slug = generateSlug(data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new Error("Category with this name already exists");

  return prisma.category.create({
    data: { name: data.name, slug, imageUrl: data.imageUrl },
  });
}

export async function updateCategory(id: number, data: Partial<CategoryInput>) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found");

  const updateData: { name?: string; slug?: string; imageUrl?: string } = {};
  if (data.name) {
    updateData.name = data.name;
    updateData.slug = generateSlug(data.name);
    const conflict = await prisma.category.findFirst({
      where: { slug: updateData.slug, NOT: { id } },
    });
    if (conflict) throw new Error("Category with this name already exists");
  }
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

  return prisma.category.update({ where: { id }, data: updateData });
}

export async function deleteCategory(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) throw new Error("Category not found");
  if (category._count.products > 0) {
    throw new Error("Cannot delete category with existing products");
  }
  return prisma.category.delete({ where: { id } });
}
