import type { Request, Response } from "express";
import addtocartService from "../service/addtocartService.js";

export default async function addtocartController(req: Request, res: Response) {
  try {
    const { productId, quantity } = req.body;
    const userId = 1;
    const cart = await addtocartService(productId, quantity, userId);

    return res.status(201).json({
      status: "success",
      message: "Cart item added successfully",
      data: cart,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Quantity must be greater than 0") {
        return res.status(404).json({
          message: error.message,
        });
      }
      if (error.message === "Product not found") {
        return res.status(404).json({
          message: error.message,
        });
      }
      if (error.message === "Product is out of stock") {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
