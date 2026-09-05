import { NextResponse } from "next/server";

const N8N_CONTACT_WEBHOOK_URL = process.env.N8N_CONTACT_WEBHOOK_URL;

function validate(body) {
  const errors = [];

  if (!body?.name?.trim()) errors.push("name");
  if (!body?.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.push("email");
  if (!body?.message?.trim() || body.message.trim().length < 10)
    errors.push("message");

  return errors;
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const invalidFields = validate(body);

  if (invalidFields.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", fields: invalidFields },
      { status: 400 }
    );
  }

  const payload = {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone?.trim() || null,
    subject: body.subject || "general",
    message: body.message.trim(),
    submittedAt: new Date().toISOString(),
    source: "contact-form",
  };

  if (!N8N_CONTACT_WEBHOOK_URL) {
    console.log("[contact] no webhook configured, payload:", payload);
    return NextResponse.json({ ok: true });
  }

  try {
    const response = await fetch(N8N_CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("[contact] webhook rejected:", response.status);
      return NextResponse.json({ error: "Upstream failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] webhook error:", error);
    return NextResponse.json({ error: "Upstream failed" }, { status: 502 });
  }
}