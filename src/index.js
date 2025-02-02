import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


dotenv.config({
    path: './.env'
});

const app = express();

app.use(cors(
    {
        origin:'*',
        credentials: true
    }
))
app.use(express.json({limit: '16kb'})); // will accept only json data upto 16kb
app.use(express.urlencoded());
app.use(express.static('public'));// allow temporary storage of files in public folder
app.use(cookieParser());
(async()=>{
    try {
        console.log('' + process.env.MONGODB_URL)
        const connectDB = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        console.log(`Connected to database: ${connectDB.connection.host}`)
    } catch (error) {
        console.error('Connection failed ',error)
    }
}).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('Server is running on port 5000')
    })
})()