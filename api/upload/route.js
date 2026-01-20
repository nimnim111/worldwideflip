import { put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req) {
    try {
        const contentType = req.headers.get("content-type");

        if (!contentType) {
            return new Response(
                JSON.stringify({ error: "Missing Content-Type" }),
                                { status: 400 }
            );
        }

        const blob = await put(
            `backflips/${Date.now()}.mp4`,
                               req.body,
                               {
                                   access: "public",
                                   contentType,
                               }
        );

        return new Response(
            JSON.stringify({ url: blob.url }),
                            {
                                status: 200,
                                headers: { "Content-Type": "application/json" },
                            }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message }),
                            {
                                status: 500,
                                headers: { "Content-Type": "application/json" },
                            }
        );
    }
}
