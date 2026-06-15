import type {Request, Response} from "express"
import deleteCartService from "../service/deleteCartService.js"

export default async function deleteCartController(req: Request, res: Response){
    try {
        const id = Number(req.params.id)
        const cart = await deleteCartService(id)
        res.status(200).json({message: "Deleted from cart", cart})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to delete from cart"})
    }
}