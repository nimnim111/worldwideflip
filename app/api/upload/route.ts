import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const form = await req.formData();

    const file = form.get("video") as File;
    const countryCode = form.get("countryCode") as string;
    const countryName = form.get("countryName") as string;
    const email = form.get("email") as string;
    const uploader = form.get("uploader") as string;

    if (!file || !email || !countryCode) {
        return new Response("Invalid request", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${countryCode}/${Date.now()}.mp4`;

    // 1️⃣ Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
    .from("backflips")
    .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
    });

    if (uploadError) {
        return new Response(uploadError.message, { status: 500 });
    }

    // 2️⃣ Get public URL
    const { data } = supabaseAdmin.storage
    .from("backflips")
    .getPublicUrl(filename);

    // 3️⃣ Insert metadata into Postgres
    await supabaseAdmin.from("backflip_videos").insert({
        country_code: countryCode,
        country_name: countryName,
        uploader_email: email,
        uploader_name: uploader,
        video_url: data.publicUrl,
        status: "pending",
    });

    return Response.json({ url: data.publicUrl });
}
