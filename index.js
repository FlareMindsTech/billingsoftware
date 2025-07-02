import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import cors from 'cors';

const App=express();
App.use(bodyParser.json())
App.use(bodyParser.urlencoded({extended:true}))
App.use(bodyParser.text())

App.use(cors());




// mongoose.connect('mongodb+srv://Subhashini:subhashini@cluster0.yrxfb3a.mongodb.net/HotelManagement?retryWrites=true&w=majority')
// .then(()=>console.log('db connected for hotel'))
// .catch((e)=>console.log('error'))

App.listen(3000,()=>{console.log("server is running on port 3000")})