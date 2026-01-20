import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
    console.log("UPLOAD API HIT");

    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    return res.status(200).json({ ok: true });
}
