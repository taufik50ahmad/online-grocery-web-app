import prisma from "../lib/prisma.js";

export default async function placeOrderService(
  orderId: number,
  userId: number
) {
  return prisma.$transaction(async (tx) => {
    // Find pending order owned by user
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        userId,
        orderStatus: "PENDING",
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }


    // Check stock availability
    for (const item of order.orderItems) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(
          `Product ${item.productName} not found`
        );
      }


      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }
    }


    // Reduce stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }


    // Submit order
    const submittedOrder = await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        orderStatus: "SUBMITTED",
      },
      include: {
        orderItems: true,
      },
    });


    return submittedOrder;
  });
}