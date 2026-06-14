import {Router} from "express"
import deleteDecreaseCartController from "../controller/deleteDecreaseCartController.js"

const router = Router()

router.delete("/cart/:id", deleteDecreaseCartController)

export default router