import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPortalSession } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id, stripeCustomerId: { not: null } },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Подписка не найдена" },
        { status: 404 }
      );
    }

    const portalSession = await createPortalSession(
      subscription.stripeCustomerId
    );

    return NextResponse.json({ url: portalSession.url });
  } catch {
    return NextResponse.json(
      { error: "Ошибка создания портала" },
      { status: 500 }
    );
  }
}
