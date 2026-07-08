import type { Request, Response } from "express";
import getOrderService from "../service/getOrderService.js";

export default async function getOrderController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user.id;

    const orderId = Number(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({
        message: "Invalid order id.",
      });
    }

    const order = await getOrderService(
      orderId,
      userId
    );

    return res.status(200).json({
      message: "Order retrieved successfully.",
      data: order,
    });

  } catch (error: any) {

    if (error.message === "Order not found.") {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}