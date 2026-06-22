import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
        if (!signingSecret) {
            return res.status(503).json({ message: "Webhook signing secret not configured" });
        }

        // @clerk/backend's verifyWebhook expects a Web Request, not an Express req.
        // express.raw() gives us req.body as a Buffer — convert to string for the Request body.
        const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
        const request = new Request("https://placeholder.url/webhooks", {
            method: "POST",
            headers: new Headers(req.headers),
            body: payload,
        });

        const evt = await verifyWebhook(request, { signingSecret });

        const { id } = evt.data;

        if (evt.type === "user.created" || evt.type === "user.updated") {
            const { email_addresses, username, image_url, first_name, last_name, primary_email_address_id } = evt.data;

            const email =
                email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address ??
                email_addresses?.[0]?.email_address;

            const displayName =
                username || [first_name, last_name].filter(Boolean).join(" ") || "user";

            await User.findOneAndUpdate(
                { clerkUserId: id },
                {
                    clerkUserId: id,
                    username: displayName,
                    email,
                    profilePicture: image_url || "",
                },
                { upsert: true, new: true, setDefaultsOnInsert: true },
            );
            console.log(`User synced (${evt.type}): ${id}`);
        }

        if (evt.type === "user.deleted") {
            if (id) await User.findOneAndDelete({ clerkUserId: id });
            console.log(`User deleted: ${id}`);
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Webhook error:", err.message);
        res.status(400).json({ error: "Webhook verification failed" });
    }
});

export default router;