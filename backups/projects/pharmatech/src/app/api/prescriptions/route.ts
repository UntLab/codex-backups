import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (!checkRateLimit(`prescription:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Çox tez sorğu. Bir az gözləyin." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Fayl seçilməyib." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fayl 5MB-dan böyük ola bilməz." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Yalnız JPG, PNG və WebP formatları qəbul olunur." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const webhookUrl = process.env.N8N_WEBHOOK_PRESCRIPTION_URL;
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
        image: dataUrl,
        source: "web",
        message: "Zəhmət olmasa bu resepti oxu və dərmanları tap.",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n responded with ${n8nResponse.status}`);
    }

    const data = await n8nResponse.json();

    return NextResponse.json({
      analysis: data.reply || data.output || "Analiz nəticəsi alınmadı.",
      products: data.products || [],
    });
  } catch (error) {
    console.error("Prescription API error:", error);
    return NextResponse.json(
      { error: "Resept analizi zamanı xəta." },
      { status: 500 }
    );
  }
}
