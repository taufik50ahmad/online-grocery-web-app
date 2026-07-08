import type { Request, Response } from "express";
import checkoutService from "../service/checkoutService.js";

export default async function checkoutController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user.id;

    const checkout = await checkoutService(userId);

    return res.status(200).json({
      message: "Checkout successful.",
      data: checkout,
    });
  } catch (error: any) {
    if (error.message === "Cart is empty.") {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.message.endsWith("not found.")) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.message.includes("only has")) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}