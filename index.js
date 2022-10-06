import express  from "express";
import dotenv from 'dotenv'
import connectDB from './config/db.js'

const app =express()
dotenv.config()






const DATABASE_URL=process.env.DATABASE_URL
connectDB(DATABASE_URL)
const port=process.env.PORT || 8080
app.listen( port, ()=>{

    console.log(`server is running on port ${port}`);
})