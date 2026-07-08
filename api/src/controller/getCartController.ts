import { getCartService } from "../service/getCartService.js";
import type { Request, Response } from "express";

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    role: string;
    isVerified?: boolean;
  };
};

export default async function getCartController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu",
      });
    }

    const cart = await getCartService(req.user.id);

    return res.status(200).json({
      status: "success",
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}