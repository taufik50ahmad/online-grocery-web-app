import prisma from "../lib/prisma.js";

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export default async function checkoutService(userId: number) {
  return await prisma.$transaction(async (tx) => {
    const pendingOrder = await tx.order.findFirst({
      where: {
        userId,
        order_status: "PENDING",
      },
      include: {
        order_items: true,
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
      0,
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
          `${item.productName} only has ${product.stock} item(s) left in stock.`,
        );
      }
    }

    async function createOrder(tx: Tx) {
      const order = await tx.order.create({
        data: {
          userId,
          total_quantity: totalQuantity,
        },
      });

      await tx.order_items.createMany({
        data: cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          total_price: item.totalPrice,
          updated_at: new Date(),
        })),
      });

      return await tx.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          order_items: true,
        },
      });
    }

    if (!pendingOrder) {
      return await createOrder(tx);
    }

    let changed = false;

    if (pendingOrder.order_items.length !== cartItems.length) {
      changed = true;
    } else {
      const cartMap = new Map(cartItems.map((item) => [item.productId, item]));

      for (const pendingItem of pendingOrder.order_items) {
        const cartItem = cartMap.get(pendingItem.product_id);

        if (!cartItem) {
          changed = true;
          break;
        }

        if (
          cartItem.quantity !== pendingItem.quantity ||
          cartItem.totalPrice !== pendingItem.total_price
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
        order_status: "CANCELLED",
      },
    });

    return await createOrder(tx);
  });
}