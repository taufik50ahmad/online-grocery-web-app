import prisma from "../lib/prisma.js";

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createProduct(data: {
  name: string;
  price: number;
  stock: number;
}) {
  return prisma.product.create({
    data,
  });
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    price?: number;
    stock?: number;
  }
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}