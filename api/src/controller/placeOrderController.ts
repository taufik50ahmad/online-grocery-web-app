import type { Request, Response } from "express";
import placeOrderService from "../service/placeOrderService.js";


interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
    isVerified: boolean;
  };
}

export default async function placeOrderController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu",
      });
    }
    const userId = Number(req.user.id);

    const orderId = Number(req.params.orderId);


    const order = await placeOrderService(
      orderId,
      userId
    );


    res.status(200).json({
      message: "Order submitted successfully",
      data: order,
    });


  } catch (error: any) {

    res.status(400).json({
      message: error.message,
    });

  }
}