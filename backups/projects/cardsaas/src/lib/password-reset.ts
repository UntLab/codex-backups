import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/user-email";

const PASSWORD_RESET_PREFIX = "password-reset:";
const PASSWORD_RESET_TTL_MS = 1000 * 60 * 60;

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getPasswordResetIdentifier(email: string): string {
  return `${PASSWORD_RESET_PREFIX}${email}`;
}

export function getPasswordResetUrl(token: string): string {
  const baseUrl =
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return new URL(
    `/reset-password?token=${encodeURIComponent(token)}`,
    baseUrl
  ).toString();
}

export async function createPasswordResetToken(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const identifier = getPasswordResetIdentifier(normalizedEmail);
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  const expires = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

  await prisma.verificationToken.deleteMany({
    where: { identifier },
  });

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: tokenHash,
      expires,
    },
  });

  return {
    email: normalizedEmail,
    token: rawToken,
    expires,
  };
}

export async function getPasswordResetTokenRecord(rawToken: string) {
  if (!rawToken?.trim()) {
    return null;
  }

  const tokenHash = hashResetToken(rawToken.trim());
  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  });

  if (!record || !record.identifier.startsWith(PASSWORD_RESET_PREFIX)) {
    return null;
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token: tokenHash },
    });
    return null;
  }

  const email = normalizeEmail(
    record.identifier.slice(PASSWORD_RESET_PREFIX.length)
  );

  if (!email) {
    return null;
  }

  return {
    email,
    identifier: record.identifier,
    tokenHash,
    expires: record.expires,
  };
}

export async function clearPasswordResetTokens(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  await prisma.verificationToken.deleteMany({
    where: { identifier: getPasswordResetIdentifier(normalizedEmail) },
  });
}
