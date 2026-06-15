import type {Request, Response} from "express"
import decreaseCartService from "../service/decreaseCartService.js"

export default async function decreaseCartController(req: Request, res: Response){
    try{
        const id = Number(req.params.id)
        const cart = await decreaseCartService(id)
        res.status(200).json({message: "Cart updated", cart})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Failed to decrease cart"})
    }
}