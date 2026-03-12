import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "cafe-riddim/submissions";
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;

    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
        .createHash("sha256")
        .update(stringToSign)
        .digest("hex");

    return NextResponse.json({
        timestamp,
        signature,
        folder,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
    });
}