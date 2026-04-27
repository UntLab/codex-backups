import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/user-email";
import {
  createPasswordResetToken,
  getPasswordResetUrl,
} from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";

const GENERIC_RESPONSE = {
  success: true,
  message:
    "If this email exists, we sent a password reset link to the inbox.",
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    });

    if (!user?.passwordHash) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const resetToken = await createPasswordResetToken(user.email);

    if (!resetToken) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const resetUrl = getPasswordResetUrl(resetToken.token);

    try {
      await sendPasswordResetEmail(
        user.email,
        user.name || user.email,
        resetUrl,
        resetToken.expires
      );
    } catch (error) {
      console.error("Forgot password email send failed", error);
    }

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("Forgot password request failed", error);
    return NextResponse.json(GENERIC_RESPONSE);
  }
}
