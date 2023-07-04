const express=require("express");
const mongoose=require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userroute=require("./Routes/route");
const Item = require("./models/Item")


const app=express();
app.get(express.urlencoded({extended:true}));
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/AuthDB");

app.use("/",userroute);


app.listen(3000,()=>{
    console.log("Connected to server successfully");
})