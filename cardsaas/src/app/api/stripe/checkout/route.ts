import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession, createOrGetCustomer } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { cardId } = await req.json();

    const card = await prisma.card.findFirst({
      where: { id: cardId, userId: session.user.id },
      include: { subscription: true },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Визитка не найдена" },
        { status: 404 }
      );
    }

    const customer = await createOrGetCustomer(
      session.user.email,
      session.user.name || undefined
    );

    const priceId = process.env.STRIPE_PRICE_ID!;

    const checkoutSession = await createCheckoutSession(
      customer.id,
      cardId,
      priceId
    );

    if (!card.subscription) {
      await prisma.subscription.create({
        data: {
          cardId: card.id,
          userId: session.user.id,
          stripeCustomerId: customer.id,
          status: "pending",
        },
      });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch {
    return NextResponse.json(
      { error: "Ошибка создания сессии оплаты" },
      { status: 500 }
    );
  }
}
