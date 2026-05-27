import express from "express";
import addtocartController from "../controller/addtocartController.js";

const router = express.Router();

router.post("/add", addtocartController)

export default router;
