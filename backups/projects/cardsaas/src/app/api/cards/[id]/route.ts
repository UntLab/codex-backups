import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { applyFormagThemeDefaults } from "@/lib/formag";
import { applyPrgThemeDefaults } from "@/lib/prg";
import { prisma } from "@/lib/prisma";
import { buildCardSlugBase } from "@/lib/slug";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const card = await prisma.card.findFirst({
    where: { id, userId: session.user.id },
    include: {
      subscription: true,
      _count: { select: { views: true } },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json({ card });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.card.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  try {
    const data = applyPrgThemeDefaults(
      applyFormagThemeDefaults(await req.json())
    );

    const nextSlug = data.slug
      ? buildCardSlugBase({
          slug: data.slug,
          fallback: existing.slug || `card-${id.slice(0, 8)}`,
        })
      : existing.slug ||
        buildCardSlugBase({
          fullName: data.fullName,
          fallback: `card-${id.slice(0, 8)}`,
        });

    if (nextSlug !== existing.slug) {
      const slugTaken = await prisma.card.findFirst({
        where: { slug: nextSlug, id: { not: id } },
      });
      if (slugTaken) {
        return NextResponse.json(
          { error: "This slug is already taken" },
          { status: 409 }
        );
      }
    }

    const card = await prisma.card.update({
      where: { id },
      data: {
        fullName: data.fullName,
        slug: nextSlug,
        jobTitle: data.jobTitle,
        company: data.company,
        bio: data.bio,
        phone: data.phone,
        secondaryPhone: data.secondaryPhone,
        email: data.email,
        website: data.website,
        officeAddress: data.officeAddress,
        avatarUrl: data.avatarUrl,
        github: data.github,
        telegram: data.telegram,
        linkedin: data.linkedin,
        facebook: data.facebook,
        instagram: data.instagram,
        whatsapp: data.whatsapp,
        tiktok: data.tiktok,
        youtube: data.youtube,
        twitter: data.twitter,
        theme: data.theme,
        accentColor: data.accentColor,
        bgColor: data.bgColor,
        tags: data.tags,
        webhookUrl: data.webhookUrl,
      },
    });

    return NextResponse.json({ card });
  } catch {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const card = await prisma.card.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  await prisma.card.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
