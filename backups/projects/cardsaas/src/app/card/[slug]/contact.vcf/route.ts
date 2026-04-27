import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildCardVCard } from "@/lib/card-contact";
import { getManualCardStatus, isManualCardAccessible } from "@/lib/billing";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const card = await prisma.card.findUnique({
    where: { slug },
    include: { subscription: true },
  });

  if (!card) {
    return new NextResponse("Card not found", { status: 404 });
  }

  const manualStatus = getManualCardStatus(card);

  if (!isManualCardAccessible(manualStatus)) {
    return new NextResponse("Card is not available", { status: 403 });
  }

  const vcard = buildCardVCard(card);

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename=\"${card.slug}.vcf\"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
