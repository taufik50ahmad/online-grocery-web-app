import { Router } from "express"
import decreaseCartController from "../controller/decreaseCartController.js"

const router = Router()

router.patch("/cart/:id", decreaseCartController)

export default router
