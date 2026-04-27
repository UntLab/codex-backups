import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "CardSaaS <noreply@2ai.az>";

function formatExpiryTime(expiresAt: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(expiresAt);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendNewLeadNotification(
  userEmail: string,
  cardName: string,
  leadData: { name?: string; phone?: string; email?: string }
) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject: `New lead from "${cardName}"`,
    html: `
      <div style="font-family: 'JetBrains Mono', monospace; background: #030305; color: #fff; padding: 30px; border-radius: 12px;">
        <h2 style="color: #00ffcc; margin-bottom: 20px;">[NEW_LEAD] New contact</h2>
        <p>Someone shared their contact details from <strong>${cardName}</strong>:</p>
        <table style="margin: 20px 0; border-collapse: collapse;">
          ${leadData.name ? `<tr><td style="color: #5a6b7c; padding: 5px 15px 5px 0;">Name:</td><td>${leadData.name}</td></tr>` : ""}
          ${leadData.phone ? `<tr><td style="color: #5a6b7c; padding: 5px 15px 5px 0;">Phone:</td><td>${leadData.phone}</td></tr>` : ""}
          ${leadData.email ? `<tr><td style="color: #5a6b7c; padding: 5px 15px 5px 0;">Email:</td><td>${leadData.email}</td></tr>` : ""}
        </table>
        <p style="color: #5a6b7c; font-size: 12px;">All leads are available in your dashboard.</p>
      </div>
    `,
  });
}

export async function sendPaymentWarning(
  userEmail: string,
  cardName: string,
  cardSlug: string
) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject: `Action needed — "${cardName}" is inactive`,
    html: `
      <div style="font-family: 'JetBrains Mono', monospace; background: #030305; color: #fff; padding: 30px; border-radius: 12px;">
        <h2 style="color: #ff003c; margin-bottom: 20px;">[ALERT] Card inactive</h2>
        <p>Your card <strong>${cardName}</strong> (/${cardSlug}) is currently inactive.</p>
        <p style="margin-top: 15px;">Contact the CardSaaS team if you need it reactivated.</p>
        <p style="color: #5a6b7c; font-size: 12px; margin-top: 20px;">CardSaaS — Digital Business Cards</p>
      </div>
    `,
  });
}

export async function sendWeeklyReport(
  userEmail: string,
  cards: { name: string; views: number; leads: number }[]
) {
  const rows = cards
    .map(
      (c) =>
        `<tr><td style="padding: 8px 15px; border-bottom: 1px solid #111;">${c.name}</td><td style="padding: 8px 15px; text-align: center; border-bottom: 1px solid #111;">${c.views}</td><td style="padding: 8px 15px; text-align: center; border-bottom: 1px solid #111; color: #00ffcc;">${c.leads}</td></tr>`
    )
    .join("");

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject: "CardSaaS Weekly Report",
    html: `
      <div style="font-family: 'JetBrains Mono', monospace; background: #030305; color: #fff; padding: 30px; border-radius: 12px;">
        <h2 style="color: #00ffcc; margin-bottom: 20px;">[REPORT] Weekly stats</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead><tr style="color: #5a6b7c; font-size: 12px;">
            <th style="text-align: left; padding: 8px 15px;">Card</th>
            <th style="text-align: center; padding: 8px 15px;">Views</th>
            <th style="text-align: center; padding: 8px 15px;">Leads</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetUrl: string,
  expiresAt: Date
) {
  const expiryLabel = formatExpiryTime(expiresAt);
  const safeUserName = escapeHtml(userName);
  const safeResetUrl = escapeHtml(resetUrl);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject: "Reset your CardSaaS password",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; background: #f6f5f3; color: #332d2c; padding: 32px;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 32px; box-shadow: 0 18px 50px rgba(0,0,0,0.06);">
          <p style="margin: 0 0 12px; letter-spacing: 0.22em; font-size: 11px; text-transform: uppercase; color: rgba(51,45,44,0.55);">
            CardSaaS Security
          </p>
          <h1 style="margin: 0; font-size: 30px; line-height: 1.05; color: #332d2c;">
            Reset your password
          </h1>
          <p style="margin: 18px 0 0; font-size: 15px; line-height: 1.7; color: rgba(51,45,44,0.82);">
            Hi ${safeUserName}, we received a request to reset the password for your CardSaaS workspace.
          </p>
          <p style="margin: 12px 0 0; font-size: 15px; line-height: 1.7; color: rgba(51,45,44,0.82);">
            This secure link stays active until <strong>${expiryLabel}</strong>. If you did not request this, you can safely ignore this email.
          </p>
          <div style="margin-top: 28px;">
            <a href="${safeResetUrl}" style="display: inline-block; padding: 14px 22px; border-radius: 14px; background: #332d2c; color: #ffffff; text-decoration: none; font-weight: 700;">
              Reset password
            </a>
          </div>
          <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.7; color: rgba(51,45,44,0.64);">
            If the button does not open, copy and paste this link into your browser:
          </p>
          <p style="margin: 8px 0 0; word-break: break-word; font-size: 13px; line-height: 1.7; color: #8f2f2e;">
            ${safeResetUrl}
          </p>
        </div>
      </div>
    `,
  });
}
