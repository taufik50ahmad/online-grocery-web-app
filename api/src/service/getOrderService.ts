import prisma from "../lib/prisma.js";

export default async function getOrderService(
  orderId: number,
  userId: number
) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
}