import express from "express";
import cors from "cors";
import User from "./models/user.model.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {clerkMiddleware} from "@clerk/express";
import job from "./lib/cron.js";
import { connectDB } from "./lib/db.js";
import clerkwebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.routes.js";
import { server } from "./lib/socket.js";
import {app} from "./lib/socket.js";
dotenv.config();


const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(),"public");

app.use("/api/webhooks/clerk",express.raw({type:'application/json'}),clerkwebhook);

app.use(express.json());
app.use(cors({origin:FRONTEND_URL,credentials:true}));


app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
    res.status(200).json({ok:true})
});

app.use("/api/routes",authRoutes)
app.use("/api/messages",messageRoutes);


if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir))
    app.get("/{*splat}",(req,res)=>{
        res.sendFile(path.join(publicDir,"index.html"))
    })
}

server.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`);

    if(process.env.NODE_ENV!="production"){
        job.start()
    }
});
