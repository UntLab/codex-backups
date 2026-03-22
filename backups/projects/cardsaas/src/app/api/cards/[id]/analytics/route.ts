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
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const totalViews = await prisma.cardView.count({
    where: { cardId: id },
  });

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const viewsLast30 = await prisma.cardView.count({
    where: {
      cardId: id,
      viewedAt: { gte: last30Days },
    },
  });

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const viewsLast7 = await prisma.cardView.count({
    where: {
      cardId: id,
      viewedAt: { gte: last7Days },
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const viewsToday = await prisma.cardView.count({
    where: {
      cardId: id,
      viewedAt: { gte: today },
    },
  });

  const dailyViews = await prisma.cardView.groupBy({
    by: ["viewedAt"],
    where: {
      cardId: id,
      viewedAt: { gte: last30Days },
    },
    _count: true,
    orderBy: { viewedAt: "asc" },
  });

  return NextResponse.json({
    totalViews,
    viewsLast30,
    viewsLast7,
    viewsToday,
    dailyViews: dailyViews.map((d) => ({
      date: d.viewedAt,
      count: d._count,
    })),
  });
}
