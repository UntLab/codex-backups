import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const cardId = searchParams.get("cardId");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (cardId) where.cardId = cardId;
  if (status) where.status = status;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { card: { select: { fullName: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({ leads, total, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { cardId, ...leadData } = data;

    if (!cardId) {
      return NextResponse.json(
        { error: "cardId is required" },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { user: { select: { email: true } } },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        cardId: card.id,
        userId: card.userId,
        name: leadData.name || null,
        phone: leadData.phone || null,
        email: leadData.email || null,
        telegram: leadData.telegram || null,
        whatsapp: leadData.whatsapp || null,
        linkedin: leadData.linkedin || null,
        instagram: leadData.instagram || null,
        facebook: leadData.facebook || null,
        source: "card_form",
      },
    });

    if (card.user.email) {
      try {
        const { sendNewLeadNotification } = await import("@/lib/email");
        await sendNewLeadNotification(card.user.email, card.fullName, {
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
        });
      } catch {
        // email sending is non-critical
      }
    }

    if (card.webhookUrl) {
      try {
        const webhookPayload = JSON.stringify({
          ...leadData,
          cardName: card.fullName,
          cardSlug: card.slug,
        });

        const webhookHeaders: HeadersInit = {
          "Content-Type": "application/json",
          "X-V2AI-Event": "lead.created",
        };

        if (process.env.WEBHOOK_AUTH_TOKEN) {
          webhookHeaders.Authorization = `Bearer ${process.env.WEBHOOK_AUTH_TOKEN}`;
        }

        const webhookResponse = await fetch(card.webhookUrl, {
          method: "POST",
          headers: webhookHeaders,
          body: webhookPayload,
        });

        if (!webhookResponse.ok) {
          console.error(
            "Lead webhook failed",
            webhookResponse.status,
            await webhookResponse.text()
          );
        }
      } catch (error) {
        console.error("Lead webhook request failed", error);
        // webhook is non-critical
      }
    }

    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}
