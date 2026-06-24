import express from "express";
import { getConversations, getUser } from "../controllers/message.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";
import {getMessages,sendMessage} from "../controllers/message.controller.js";
import upload from "../middleware/upload.middleware.js";
const router = express.Router();

router.use(protectRoute);

router.get("/users",getUser);
router.get("/conversations",getConversations);
router.get("/:id",getMessages)
router.post("/send/:id",upload.single("media"),sendMessage)
export default router;