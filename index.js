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

mongoose.connect('mongodb+srv://flaremindstech:flareminds%401308@cluster0.12wutsc.mongodb.net/billingsoftware?retryWrites=true&w=majority&appName=Cluster0')
 .then(() => console.log('Connected to MongoDB Atlas...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

const port = process.env.PORT || 7372;

App.listen(port, () => {
  console.log("Server connected to " + port); 
});  