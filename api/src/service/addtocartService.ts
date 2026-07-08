import prisma from "../lib/prisma.js";

export default async function addtoCartService(
  productId: number,
  quantity: number,
  userId: number
) {
  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Product is out of stock");
  }

  const existingCart = await prisma.cartItem.findFirst({
    where: {
      productId: product.id,
      userId,
    },
  });

  if (existingCart) {
    const newQuantity = existingCart.quantity + quantity;

    return prisma.cartItem.update({
      where: {
        id: existingCart.id,
      },
      data: {
        quantity: newQuantity,
        totalPrice: product.price * newQuantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      productId: product.id,
      userId,
      productName: product.name,
      quantity,
      totalPrice: product.price * quantity,
    },
  });
}