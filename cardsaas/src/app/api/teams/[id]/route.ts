import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Team name is required" },
      { status: 400 }
    );
  }

  const team = await prisma.team.findFirst({
    where: { id, ownerId: session.user.id },
  });

  if (!team) {
    return NextResponse.json(
      { error: "Team not found or you are not the owner" },
      { status: 403 }
    );
  }

  const updated = await prisma.team.update({
    where: { id },
    data: { name: name.trim() },
  });

  return NextResponse.json({ team: updated });
}
