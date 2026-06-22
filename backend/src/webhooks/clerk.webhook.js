import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/express";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const evt = await verifyWebhook(req);

        const { id } = evt.data;
        const eventType = evt.type;

        if (eventType === "user.created") {
            const { email_addresses, username, image_url, first_name, last_name } = evt.data;
            const displayName = username || [first_name, last_name].filter(Boolean).join(" ") || "user";

            await User.create({
                clerkUserId: id,
                username: displayName,
                email: email_addresses[0].email_address,
                profilePicture: image_url || "",
            });
            console.log(`User created: ${id}`);
        }

        if (eventType === "user.updated") {
            const { email_addresses, username, image_url, first_name, last_name } = evt.data;
            const displayName = username || [first_name, last_name].filter(Boolean).join(" ") || "user";

            await User.findOneAndUpdate(
                { clerkUserId: id },
                {
                    username: displayName,
                    email: email_addresses[0].email_address,
                    profilePicture: image_url || "",
                },
            );
            console.log(`User updated: ${id}`);
        }

        if (eventType === "user.deleted") {
            await User.findOneAndDelete({ clerkUserId: id });
            console.log(`User deleted: ${id}`);
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Webhook error:", err.message);
        res.status(400).json({ error: "Webhook verification failed" });
    }
});

export default router;