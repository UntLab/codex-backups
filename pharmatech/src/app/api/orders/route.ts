import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, sanitizeInput } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (!checkRateLimit(`order:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Çox tez sorğu." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Auth xidməti mövcud deyil." },
        { status: 503 }
      );
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Giriş tələb olunur." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.items?.length) {
      return NextResponse.json(
        { error: "Səbət boşdur." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_ORDER_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Xidmət mövcud deyil." },
        { status: 503 }
      );
    }

    const orderPayload = {
      user_id: user.id,
      user_email: user.email,
      user_name: user.user_metadata?.full_name || "",
      phone: sanitizeInput(body.phone || ""),
      delivery_address: sanitizeInput(body.delivery_address || ""),
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      items: body.items.map(
        (item: {
          product_id: string;
          product_name: string;
          quantity: number;
          price: number;
        }) => ({
          product_id: item.product_id,
          product_name: sanitizeInput(item.product_name),
          quantity: Math.max(1, Math.min(99, Math.floor(item.quantity))),
          price: Number(item.price),
        })
      ),
      total: Number(body.total),
      source: "web",
      timestamp: new Date().toISOString(),
    };

    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n responded with ${n8nResponse.status}`);
    }

    const data = await n8nResponse.json();

    return NextResponse.json({
      success: true,
      order_id: data.order_id || data.id,
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Sifariş zamanı xəta." },
      { status: 500 }
    );
  }
}
