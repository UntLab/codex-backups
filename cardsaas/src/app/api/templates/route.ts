import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await prisma.cardTemplate.findMany({
    where: {
      OR: [
        { isSystem: true },
        { isPublic: true },
        { userId: session.user.id },
      ],
    },
    orderBy: [{ isSystem: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const template = await prisma.cardTemplate.create({
      data: {
        name: data.name,
        userId: session.user.id,
        isPublic: data.isPublic || false,
        theme: data.theme || "cyberpunk",
        accentColor: data.accentColor || "#00ffcc",
        bgColor: data.bgColor || "#030305",
        fontFamily: data.fontFamily || "Inter",
        borderRadius: data.borderRadius || "16",
        cardStyle: data.cardStyle || null,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
