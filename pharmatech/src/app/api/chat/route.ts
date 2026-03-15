import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput, checkRateLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (!checkRateLimit(`chat:${ip}`, 20, 60_000)) {
      return NextResponse.json(
        { error: "Çox tez sorğu göndərirsiniz. Bir az gözləyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const message = sanitizeInput(body.message || "");

    if (!message) {
      return NextResponse.json(
        { error: "Mesaj boş ola bilməz." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_CHAT_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Xidmət mövcud deyil." },
        { status: 503 }
      );
    }

    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        source: "web",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n responded with ${n8nResponse.status}`);
    }

    const data = await n8nResponse.json();

    return NextResponse.json({
      reply: data.reply || data.output || "Cavab alınmadı.",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Daxili xəta. Yenidən cəhd edin." },
      { status: 500 }
    );
  }
}
