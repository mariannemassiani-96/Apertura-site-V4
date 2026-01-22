import { sendBrevoEmail } from "./brevo";
import { NotifyEvent, renderEmail } from "./templates";

export async function dispatchEmail(params: {
  event: NotifyEvent;
  to: Array<{ email: string; name?: string }>;
  ctx: Record<string, any>;
}) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) throw new Error("Missing env BREVO_SENDER_EMAIL");

  const senderName = process.env.BREVO_SENDER_NAME ?? "Apertura di Corsica";

  const { subject, html } = renderEmail(params.event, params.ctx);

  return sendBrevoEmail({
    sender: { email: senderEmail, name: senderName },
    to: params.to,
    subject,
    htmlContent: html,
  });
}
