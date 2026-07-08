import prisma from "../lib/prisma.js";

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export default async function checkoutService(userId: number) {
  return await prisma.$transaction(async (tx) => {
    // Get pending order
    const pendingOrder = await tx.order.findFirst({
      where: {
        userId,
        orderStatus: "PENDING",
      },
      include: {
        orderItems: true,
      },
    });

    // Get cart items
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

    // Prevent checkout with empty cart
    if (cartItems.length === 0) {
      throw new Error("Cart is empty.");
    }

    // Calculate total quantity
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Validate stock
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

    const productMap = new Map(products.map((p) => [p.id, p]));

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

    async function createOrder(tx: Tx) {
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

    // No pending order, create one
    if (!pendingOrder) {
      return await createOrder(tx);
    }

    // Check whether cart has changed
    let changed = false;

    if (pendingOrder.orderItems.length !== cartItems.length) {
      changed = true;
    } else {
      const cartMap = new Map(
        cartItems.map((item) => [item.productId, item])
      );

      for (const pendingItem of pendingOrder.orderItems) {
        const cartItem = cartMap.get(pendingItem.productId);

        if (!cartItem) {
          changed = true;
          break;
        }

        if (
          cartItem.quantity !== pendingItem.quantity ||
          cartItem.totalPrice !== pendingItem.totalPrice
        ) {
          changed = true;
          break;
        }
      }
    }

    // Nothing changed
    if (!changed) {
      return pendingOrder;
    }

    // Cancel previous pending order
    await tx.order.update({
      where: {
        id: pendingOrder.id,
      },
      data: {
        orderStatus: "CANCELLED",
      },
    });

    // Create replacement order
    return await createOrder(tx);
  });
}
