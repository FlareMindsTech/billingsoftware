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

App.get("/", (req, res) => {
  res.send("welcome"); 
});

mongoose.connect('mongodb://127.0.0.1:27017/billingsoftware')
.then(()=>console.log('db connected for billingsoftware'))
.catch((e)=>console.log('error'))

const port = process.env.PORT || 7372;

App.listen(port, () => {
  console.log("Server connected to " + port); 
});