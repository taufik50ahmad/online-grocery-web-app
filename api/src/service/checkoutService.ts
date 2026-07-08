import prisma from "../lib/prisma.js";

export default async function checkoutService(userId: number) {
  return prisma.$transaction(async (tx) => {
    const pendingOrder = await tx.order.findFirst({
      where: {
        userId,
        orderStatus: "PENDING",
      },
      include: {
        orderItems: true,
      },
    });

    const cartItems = await tx.cartItem.findMany({
      where: {
        userId,
      },
      select: {
        productId: true,
        productName: true,
        quantity: true,
        totalPrice: true,
      },
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty.");
    }

    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const products = await tx.product.findMany({
      where: {
        id: {
          in: cartItems.map((item) => item.productId),
        },
      },
      select: {
        id: true,
        stock: true,
      },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));

    for (const item of cartItems) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(`${item.productName} not found.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `${item.productName} only has ${product.stock} item(s) left in stock.`
        );
      }
    }

    async function createOrder() {
      const order = await tx.order.create({
        data: {
          userId,
          totalQuantity,
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
      });

      return order;
    }

    if (!pendingOrder) {
      return createOrder();
    }

    let changed = pendingOrder.orderItems.length !== cartItems.length;

    if (!changed) {
      const cartMap = new Map(
        cartItems.map((item) => [item.productId, item])
      );

      for (const orderItem of pendingOrder.orderItems) {
        const cartItem = cartMap.get(orderItem.productId);

        if (
          !cartItem ||
          cartItem.quantity !== orderItem.quantity ||
          cartItem.totalPrice !== orderItem.totalPrice
        ) {
          changed = true;
          break;
        }
      }
    }

    if (!changed) {
      return pendingOrder;
    }

    await tx.order.update({
      where: {
        id: pendingOrder.id,
      },
      data: {
        orderStatus: "CANCELLED",
      },
    });

    return createOrder();
  });
}