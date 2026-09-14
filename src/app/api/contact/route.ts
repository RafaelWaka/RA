import { NextRequest, NextResponse } from "next/server";
import { addContactMessage } from "@/lib/contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject : "Autre";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json({ error: "Champs invalides." }, { status: 400 });
  }

  await addContactMessage({ name, email, subject, message });

  // Extension possible : envoyer un email de notification (Resend, etc.)
  return NextResponse.json({ ok: true });
}
