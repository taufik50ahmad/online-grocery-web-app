import { getCartService } from "../service/getCartService.js";
import type {Request, Response} from "express";

export default async function getCartController(req: Request, res: Response){
    try {
        const cart = await getCartService(1);

        return res.status(200).json({
            status: "success",
            message: "Cart retrieved successfully",
            data: cart,
        })
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