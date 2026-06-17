import {Router} from "express"
import deleteCartController from "../controller/deleteCartController.js"

const router = Router()

router.delete("/cart/:id", deleteCartController)

export default router