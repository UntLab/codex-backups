import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getManualCardStatus, getServerBillingMode } from "@/lib/billing";
import { applyFormagThemeDefaults } from "@/lib/formag";
import { applyPrgThemeDefaults } from "@/lib/prg";
import { prisma } from "@/lib/prisma";
import { buildCardSlugBase } from "@/lib/slug";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cards = await prisma.card.findMany({
    where: { userId: session.user.id },
    include: {
      subscription: true,
      _count: { select: { views: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    cards: cards.map((card) => ({
      ...card,
      manualStatus: getManualCardStatus(card),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = applyPrgThemeDefaults(
      applyFormagThemeDefaults(await req.json())
    );
    const isManualMode = getServerBillingMode() === "manual";
    const trialEndsAt =
      !isManualMode
        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        : null;

    const slugBase = buildCardSlugBase({
      slug: data.slug,
      fullName: data.fullName,
      fallback: `card-${Date.now().toString(36)}`,
    });

    let slug = slugBase;
    let counter = 1;
    while (await prisma.card.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${counter++}`;
    }

    const card = await prisma.card.create({
      data: {
        slug,
        userId: session.user.id,
        active: !isManualMode,
        fullName: data.fullName,
        jobTitle: data.jobTitle || null,
        company: data.company || null,
        bio: data.bio || null,
        phone: data.phone || null,
        secondaryPhone: data.secondaryPhone || null,
        email: data.email || null,
        website: data.website || null,
        officeAddress: data.officeAddress || null,
        avatarUrl: data.avatarUrl || null,
        github: data.github || null,
        telegram: data.telegram || null,
        linkedin: data.linkedin || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        whatsapp: data.whatsapp || null,
        tiktok: data.tiktok || null,
        youtube: data.youtube || null,
        twitter: data.twitter || null,
        theme: data.theme || "cyberpunk",
        accentColor: data.accentColor || "#00ffcc",
        bgColor: data.bgColor || "#030305",
        tags: data.tags || [],
        webhookUrl: data.webhookUrl || null,
        trialEndsAt,
        subscription: isManualMode
          ? {
              create: {
                userId: session.user.id,
                status: "pending",
              },
            }
          : undefined,
      },
      include: {
        subscription: true,
      },
    });

    return NextResponse.json(
      {
        card: {
          ...card,
          manualStatus: getManualCardStatus(card),
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
