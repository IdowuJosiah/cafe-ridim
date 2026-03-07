import { NextRequest, NextResponse } from "next/server";
import cloudinary, { UploadApiResponse } from "../../../lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const artistName = formData.get("artistName");
        const email = formData.get("email");
        const trackTitle = formData.get("trackTitle");
        const link = formData.get("link");
        const message = formData.get("message");
        const file = formData.get("file") as File | null;

        let fileUrl = null;

        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const upload = await new Promise<UploadApiResponse>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto",
                        folder: "cafe-riddim/submissions",
                        public_id: `${artistName}-${trackTitle}`.replace(/\s+/g, "-"),
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary error:", error); // add this
                            reject(error);
                        }
                        else resolve(result as UploadApiResponse);
                    }
                ).end(buffer);
            });

            fileUrl = upload.secure_url;
        }

        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "josiahidowutioluwanimi@gmail.com", // replace with your actual email
            subject: `New Submission — ${trackTitle} by ${artistName}`,
            html: `
        <h2>New Music Submission</h2>
        <p><strong>Artist:</strong> ${artistName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Track:</strong> ${trackTitle}</p>
        <p><strong>Link:</strong> <a href="${link}">${link}</a></p>
        <p><strong>Message:</strong> ${message || "None"}</p>
        ${fileUrl ? `<p><strong>File:</strong> <a href="${fileUrl}">${fileUrl}</a></p>` : ""}
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}