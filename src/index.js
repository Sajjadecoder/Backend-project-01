import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
});

const app = express();

(async()=>{
    try {
        console.log('' + process.env.MONGODB_URL)
        const connectDB = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on('error', (error) => {
            console.log('ERROR: ',error)
        })

        app.listen(process.env.PORT, () => {
            console.log('Server is running on port: ', process.env.PORT)
        })

        console.log(`Connected to database: ${connectDB.connection.host}`)
    } catch (error) {
        console.error('Connection failed ',error)
    }
})()