import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const card = await prisma.card.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!card) {
    return NextResponse.json({ error: "Визитка не найдена" }, { status: 404 });
  }

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/card/${card.slug}`;

  const qrDataUrl = await QRCode.toDataURL(cardUrl, {
    width: 400,
    margin: 2,
    color: {
      dark: card.accentColor,
      light: "#00000000",
    },
  });

  return NextResponse.json({ qr: qrDataUrl, url: cardUrl });
}
