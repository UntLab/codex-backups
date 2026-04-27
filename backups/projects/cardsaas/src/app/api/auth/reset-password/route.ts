import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  clearPasswordResetTokens,
  getPasswordResetTokenRecord,
} from "@/lib/password-reset";

function getInvalidTokenResponse() {
  return NextResponse.json(
    { error: "This reset link is invalid or expired." },
    { status: 400 }
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const tokenRecord = token
    ? await getPasswordResetTokenRecord(token)
    : null;

  return NextResponse.json({ valid: Boolean(tokenRecord) });
}

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const tokenRecord =
      typeof token === "string" ? await getPasswordResetTokenRecord(token) : null;

    if (!tokenRecord) {
      return getInvalidTokenResponse();
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: tokenRecord.email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return getInvalidTokenResponse();
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await clearPasswordResetTokens(user.email);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Reset password request failed", error);
    return NextResponse.json(
      { error: "Unable to reset password right now." },
      { status: 500 }
    );
  }
}
