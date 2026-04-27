import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  applyFormagThemeDefaults,
  FORMAG_SYSTEM_TEMPLATE,
  FORMAG_THEME,
} from "@/lib/formag";
import {
  applyPrgThemeDefaults,
  PRG_ORANGE_SYSTEM_TEMPLATE,
  PRG_ORANGE_THEME,
  PRG_SYSTEM_TEMPLATE,
  PRG_THEME,
} from "@/lib/prg";
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

  const withSystemTemplates = [...templates];

  if (!templates.some((template) => template.isSystem && template.theme === PRG_THEME)) {
    withSystemTemplates.unshift(PRG_SYSTEM_TEMPLATE);
  }

  if (!templates.some((template) => template.isSystem && template.theme === PRG_ORANGE_THEME)) {
    withSystemTemplates.unshift(PRG_ORANGE_SYSTEM_TEMPLATE);
  }

  if (!templates.some((template) => template.isSystem && template.theme === FORMAG_THEME)) {
    withSystemTemplates.unshift(FORMAG_SYSTEM_TEMPLATE);
  }

  return NextResponse.json({ templates: withSystemTemplates });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = applyPrgThemeDefaults(
      applyFormagThemeDefaults(await req.json())
    );

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
