import express from "express";
import getCheckoutController from "../controller/getCheckoutController.js";

const router = express.Router();

router.get("/get/checkout", getCheckoutController);

export default router;