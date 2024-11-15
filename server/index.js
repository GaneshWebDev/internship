const express=require('express');
const app=express();
const cors=require('cors');
const connectDB= require('./db');
const userRouter=require('./routes/userRoute');
require('dotenv').config();
app.use(express.json());
app.use(cors({
    origin: 'https://internship-2new.onrender.com/',
  }));
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
connectDB();
app.listen(process.env.PORT_NUMBER,()=>{
    console.log(`server listening to port number ${process.env.PORT_NUMBER}`);
});
