import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import cors from 'cors';
import user from "./routes/userRoute.js"
import bill from "./routes/billRoute.js"
const App=express();
App.use(bodyParser.json())
App.use(bodyParser.urlencoded({extended:true}))
App.use(bodyParser.text())

App.use(cors());
App.use('/api/user',user)
App.use('/api/bill',bill)




mongoose.connect('mongodb://127.0.0.1:27017/billingsoftware')
.then(()=>console.log('db connected for billingsoftware'))
.catch((e)=>console.log('error'))

App.listen(5000,()=>{console.log("server is running on port 5000")})