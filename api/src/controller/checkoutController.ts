import type { Request, Response } from "express";
import checkoutService from "../service/checkoutService.js";

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    role: string;
    isVerified?: boolean;
  };
};

export default async function checkoutController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu.",
      });
    }

    const userId = req.user.id;

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

    console.error("CHECKOUT ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
}