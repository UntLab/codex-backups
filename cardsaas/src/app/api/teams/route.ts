import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      ownedTeams: {
        include: {
          members: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
      team: {
        include: {
          owner: { select: { id: true, name: true, email: true } },
          members: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
    },
  });

  return NextResponse.json({
    ownedTeams: user?.ownedTeams || [],
    memberOf: user?.team || null,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Team name is required" },
      { status: 400 }
    );
  }

  const team = await prisma.team.create({
    data: {
      name,
      ownerId: session.user.id,
      members: { connect: { id: session.user.id } },
    },
  });

  return NextResponse.json({ team }, { status: 201 });
}
