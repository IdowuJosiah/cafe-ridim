import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { artistName, email, trackTitle, link, message, fileUrl } = await req.json();

        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "submissions@contact.jazzthedev.site",
            to: "jesudunsinbankole@gmail.com",
            subject: `New Submission — ${trackTitle} by ${artistName}`,
            html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
  <div style="background-color: #48523D; padding: 32px 40px;">
    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;"> New Music Submission</h1>
  </div>

  <!-- Body -->
  <div style="padding: 32px 40px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8C2E0B; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 100px; vertical-align: top;">Artist</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333333; font-size: 15px;">${artistName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8C2E0B; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;">Email</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333333; font-size: 15px;"><a href="mailto:${email}" style="color: #D93F07; text-decoration: none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8C2E0B; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;">Track</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333333; font-size: 15px;">${trackTitle}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8C2E0B; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;">Link</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;"><a href="${link}" style="color: #D93F07; text-decoration: none;">${link}</a></td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8C2E0B; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;">Message</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333333; font-size: 15px;">${message || "None"}</td>
      </tr>
      ${fileUrl ? `
      <tr>
        <td style="padding: 12px 0; color: #8C2E0B; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;"> Music File</td>
        <td style="padding: 12px 0; font-size: 15px;"><a href="${fileUrl}" style="display: inline-block; background-color: #F28B0C; color: #ffffff; padding: 8px 20px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600;">Download File</a></td>
      </tr>
      ` : ""}
    </table>
  </div>

  <!-- Footer -->
  <div style="background-color: #591E0B; padding: 20px 40px; text-align: center;">
    <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 12px;">Music Submission Portal</p>
  </div>
</div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}