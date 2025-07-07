import express from "express";
import { Auth, protect } from "../authentication/auth.js";
import { CreateNewBill, deleteBill, listBill, updateBill } from "../controller/billController.js";


const router=express.Router()

router.post("/createbill",Auth,CreateNewBill)
router.put("/updatebill",updateBill)
router.post("/listbill",Auth,listBill)
router.put("/deletebill",deleteBill)

export default router;  