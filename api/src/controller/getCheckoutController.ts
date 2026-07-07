import type { Request, Response } from "express";
import getCheckoutService from "../service/getCheckoutService.js";

export default async function getCheckoutController(req:Request, res:Response){
    try{
        const checkoutItem = await getCheckoutService()

        res.status(200).json({
            message:"Success",
            data:checkoutItem
        })
    }
    catch(error:any){
        if(error.message === "Checkout Item Not Found"){
            res.status(404).json({
                message:error.message
            })
            return
        }
        res.status(500).json({
            message:"Internal server error"
        })
    }
}