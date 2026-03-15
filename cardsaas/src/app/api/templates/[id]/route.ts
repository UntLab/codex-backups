import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const template = await prisma.cardTemplate.findFirst({
    where: { id, userId: session.user.id, isSystem: false },
  });

  if (!template) {
    return NextResponse.json(
      { error: "Шаблон не найден или нельзя удалить" },
      { status: 404 }
    );
  }

  await prisma.cardTemplate.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
