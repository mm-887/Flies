import express from "express";
import cors from "cors";
import User from "./models/user.model.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {clerkMiddleware} from "@clerk/express";

import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();


const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(),"public");

app.use(express.json());
app.use(cors({origin:FRONTEND_URL,credentials:true}));


app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
    res.status(200).json({ok:true})
});

if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(publicDir,"index.html"))
    })
}

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`);
})
