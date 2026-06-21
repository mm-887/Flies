import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    content: {type: String, required:true},
    image: {type:String},
    video: {type:String},
    reciever: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    timestamp: {type:Date, default:Date.now},
},
{timestamps:true},
);

export const Message = mongoose.model("Message", messageSchema);
