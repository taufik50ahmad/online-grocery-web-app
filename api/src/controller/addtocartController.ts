import type { Request, Response } from "express";
import addtocartService from "../service/addtocartService.js";

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    role: string;
    isVerified?: boolean;
  };
};

export default async function addtocartController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu",
      });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await addtocartService(
      Number(productId),
      Number(quantity),
      userId
    );

    return res.status(201).json({
      status: "success",
      message: "Cart item added successfully",
      data: cart,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message === "Quantity must be greater than 0" ||
        error.message === "Product not found" ||
        error.message === "Product is out of stock"
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

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