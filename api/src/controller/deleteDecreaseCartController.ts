import type {Request, Response} from "express"
import deleteDecreaseCartService from "../service/deleteDecreaseCartService.js"

export default async function deleteDecreaseCartController(req: Request, res: Response){
    try {
        const id = Number(req.params.id)
        const cart = await deleteDecreaseCartService(id)
        res.status(200).json({message: "Deleted from cart", cart})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to delete from cart"})
    }
}