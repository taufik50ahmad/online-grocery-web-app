import express from "express";
import getCartController from "../controller/getCartController.js";

const router = express.Router();

router.get("/get/cart", getCartController);

export default router;