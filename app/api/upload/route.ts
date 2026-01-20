console.log("UPLOAD API HIT");
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();

        const file = form.get("video") as File;
        const countryCode = form.get("countryCode") as string;
        const countryName = form.get("countryName") as string;
        const email = form.get("email") as string;
        const uploader = form.get("uploader") as string;

        if (!file || !email || !countryCode) {
            return new Response("Missing fields", { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${countryCode}/${Date.now()}.mp4`;

        const { error: uploadError } = await supabaseAdmin.storage
        .from("backflips")
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
        });

        if (uploadError) {
            console.error("SUPABASE UPLOAD ERROR:", uploadError);
            return new Response(uploadError.message, { status: 500 });
        }

        const { data } = supabaseAdmin.storage
        .from("backflips")
        .getPublicUrl(filename);

        const { error: dbError } = await supabaseAdmin
        .from("backflip_videos")
        .insert({
            country_code: countryCode,
            country_name: countryName,
            uploader_email: email,
            uploader_name: uploader,
            video_url: data.publicUrl,
            status: "pending",
        });

        if (dbError) {
            console.error("DB INSERT ERROR:", dbError);
            return new Response(dbError.message, { status: 500 });
        }

        return Response.json({ url: data.publicUrl });
    } catch (err: any) {
        console.error("UPLOAD ROUTE CRASHED:", err);
        return new Response(err.message || "Server error", { status: 500 });
    }
}
