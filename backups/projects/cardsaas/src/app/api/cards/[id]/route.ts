import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const data = await req.json();

    if (data.slug && data.slug !== existing.slug) {
      const slugTaken = await prisma.card.findFirst({
        where: { slug: data.slug, id: { not: id } },
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
        slug: data.slug || existing.slug,
        jobTitle: data.jobTitle,
        company: data.company,
        bio: data.bio,
        phone: data.phone,
        email: data.email,
        website: data.website,
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
