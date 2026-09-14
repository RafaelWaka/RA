import { NextRequest, NextResponse } from "next/server";
import { subscribe } from "@/lib/newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const source = typeof body?.source === "string" ? body.source : "unknown";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  subscribe(email, source);
  return NextResponse.json({ ok: true });
}
