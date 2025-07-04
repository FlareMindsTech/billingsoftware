import express from "express";
import { login, Register } from "../controller/userController.js";
import { Auth, protect } from "../authentication/auth.js";


const router=express.Router()

router.post("/createuser",protect,Register)
router.post("/login",login)

export default router;  