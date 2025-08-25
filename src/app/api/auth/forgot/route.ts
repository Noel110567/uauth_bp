

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
  }

  // Configure SMTP transport using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Generate a fake reset link (replace with real token logic in production)
  const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset?email=${encodeURIComponent(email)}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });
    return NextResponse.json({ success: true, message: "If this email exists, a reset link has been sent." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to send email." }, { status: 500 });
  }
}
