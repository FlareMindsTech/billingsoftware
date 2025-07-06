import express from "express";
import { Auth, protect } from "../authentication/auth.js";
import { CreateNewBill, listBill, updateBill } from "../controller/billController.js";


const router=express.Router()

router.post("/createbill",CreateNewBill)
router.put("/updatebill",updateBill)
router.put("/listbill",listBill)

export default router;  