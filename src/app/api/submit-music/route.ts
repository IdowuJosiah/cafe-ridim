import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { artistName, email, trackTitle, link, message, fileUrl } = await req.json();

        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "josiahidowutioluwanimi@gmail.com",
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