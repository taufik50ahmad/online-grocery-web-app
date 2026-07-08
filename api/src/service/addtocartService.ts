import prisma from "../lib/prisma.js";

export default async function addtoCartService(
  productId: number,
  quantity: number,
  userId: number
) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const existingCart = await prisma.cartItem.findFirst({
    where: {
      productId,
      userId,
    },
  });

  if (existingCart) {
    const newQuantity = existingCart.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error("Product is out of stock");
    }

    return await prisma.cartItem.update({
      where: {
        id: existingCart.id,
      },
      data: {
        quantity: newQuantity,
        totalPrice: product.price * newQuantity,
      },
    });
  }

  if (product.stock < quantity) {
    throw new Error("Product is out of stock");
  }

  return await prisma.cartItem.create({
    data: {
      productId,
      userId,
      productName: product.name,
      quantity,
      totalPrice: product.price * quantity,
    },
  });
}