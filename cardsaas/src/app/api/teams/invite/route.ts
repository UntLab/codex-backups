import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { teamId, email } = await req.json();

  const team = await prisma.team.findFirst({
    where: { id: teamId, ownerId: session.user.id },
  });

  if (!team) {
    return NextResponse.json(
      { error: "Команда не найдена или вы не владелец" },
      { status: 403 }
    );
  }

  const userToInvite = await prisma.user.findUnique({ where: { email } });

  if (!userToInvite) {
    return NextResponse.json(
      { error: "Пользователь с таким email не найден. Он должен сначала зарегистрироваться." },
      { status: 404 }
    );
  }

  await prisma.user.update({
    where: { id: userToInvite.id },
    data: { teamId: team.id },
  });

  return NextResponse.json({ success: true, member: { id: userToInvite.id, name: userToInvite.name, email: userToInvite.email } });
}
