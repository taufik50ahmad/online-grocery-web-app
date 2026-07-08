import prisma from "../lib/prisma.js";

export default async function addtoCartService(
  productId: number,
  quantity: number,
  userId: number
) {
  console.time("TOTAL");

  console.time("findProduct");
  const products = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  console.timeEnd("findProduct");

  if (!products) {
    console.timeEnd("TOTAL");
    throw new Error("Product not found");
  }

  if (quantity <= 0) {
    console.timeEnd("TOTAL");
    throw new Error("Quantity must be greater than 0");
  }

  if (products.stock < quantity) {
    console.timeEnd("TOTAL");
    throw new Error("Product is out of stock");
  }

  console.time("findCart");
  const existingCart = await prisma.cartItem.findFirst({
    where: {
      productId: products.id,
      userId: userId,
    },
  });
  console.timeEnd("findCart");

  if (existingCart) {
    console.time("updateCart");

    const result = await prisma.cartItem.update({
      where: { id: existingCart.id },
      data: {
        quantity: existingCart.quantity + 1,
        totalPrice: products.price * (existingCart.quantity + 1),
      },
    });

    console.timeEnd("updateCart");
    console.timeEnd("TOTAL");

    return result;
  }

  console.time("createCart");

  const TEST_USER_ID = 1;
  const cart = await prisma.cartItem.create({
    data: {
      productId: products.id,
      userId: TEST_USER_ID,
      productName: products.name,
      quantity: quantity,
      totalPrice: products.price * quantity,
    },
  });

  console.timeEnd("createCart");
  console.timeEnd("TOTAL");

  return cart;
}