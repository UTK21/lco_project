const express = require('express');
require("dotenv").config();
const app = express();
const morgan = require('morgan')
const cookieParser =require("cookie-parser")
const fileupload= require('express-fileupload')

//regular middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//cookie and files middlewares
app.use(cookieParser());
app.use(fileupload())

//morgan middlewares
app.use(morgan("tiny"));

//import all routes here
const home =require('./routes/home')
const user =require('./routes/user')
const product=require('./routes/product')

//router middleware
app.use("/api/v1",home);
app.use("/api/v1",user);
app.use("/api/v1",product);

//export app.js
module.exports=app;