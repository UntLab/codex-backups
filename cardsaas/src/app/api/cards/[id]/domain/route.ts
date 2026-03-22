import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
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

  const { domain } = await req.json();

  if (domain) {
    const cleanDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .trim();

    const existing = await prisma.card.findFirst({
      where: { customDomain: cleanDomain, id: { not: id } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This domain is already attached to another card" },
        { status: 409 }
      );
    }

    await prisma.card.update({
      where: { id },
      data: { customDomain: cleanDomain, domainVerified: false },
    });

    return NextResponse.json({
      domain: cleanDomain,
      verified: false,
      instructions: {
        type: "CNAME",
        name: cleanDomain,
        value: process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") || "app.cardsaas.com",
        note: "Add a CNAME record in your domain DNS. Verification may take up to 24 hours.",
      },
    });
  }

  await prisma.card.update({
    where: { id },
    data: { customDomain: null, domainVerified: false },
  });

  return NextResponse.json({ domain: null });
}
