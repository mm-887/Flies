import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: [process.env.FRONTEND_URL || "http://localhost:5173"] } });

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //broadcast online users to every connected user

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); //broadcast online users to every connected user
    });
});

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};

export { app,io, server, getReceiverSocketId };