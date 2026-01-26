export type NotifyEvent =
  | "SIGNATURE_REQUIRED"
  | "ORDER_SIGNED"
  | "DEPOSIT_REQUIRED"
  | "DEPOSIT_RECEIVED"
  | "DELIVERY_CONFIRMED"
  | "USER_INVITE";

/**
 * Helper optionnel (tu peux le garder, mais le flux standard passe par renderEmail)
 */
export function inviteUserEmail(params: { toName: string; link: string }) {
  return {
    subject: "Invitation Portail PRO Apertura",
    html: `
      <p>Bonjour ${params.toName || ""},</p>
      <p>Vous avez été invité(e) à accéder au Portail PRO Apertura.</p>
      <p><a href="${params.link}">Définir mon mot de passe</a></p>
      <p>Ce lien est valable 24h.</p>
    `,
  };
}

export function renderEmail(event: NotifyEvent, ctx: Record<string, any>) {
  const brand = "Apertura di Corsica";
  const orderName = ctx.orderName ?? "Commande";
  const portalUrl = ctx.portalUrl ?? "https://example.com/pro";

  switch (event) {
    case "SIGNATURE_REQUIRED":
      return {
        subject: `[${brand}] Signature requise – ${orderName}`,
        html: `<p>Votre commande <b>${orderName}</b> nécessite une signature pour être validée.</p>
<p><a href="${portalUrl}">Accéder au portail</a></p>`,
      };

    case "ORDER_SIGNED":
      return {
        subject: `[${brand}] Commande signée – ${orderName}`,
        html: `<p>Merci. La commande <b>${orderName}</b> a bien été signée.</p>
<p><a href="${portalUrl}">Accéder au portail</a></p>`,
      };

    case "DEPOSIT_REQUIRED":
      return {
        subject: `[${brand}] Acompte requis – ${orderName}`,
        html: `<p>Un acompte est requis pour lancer la commande <b>${orderName}</b>.</p>
<p><a href="${portalUrl}">Accéder au portail</a></p>`,
      };

    case "DEPOSIT_RECEIVED":
      return {
        subject: `[${brand}] Acompte reçu – ${orderName}`,
        html: `<p>Nous confirmons la réception de l’acompte pour la commande <b>${orderName}</b>.</p>
<p><a href="${portalUrl}">Accéder au portail</a></p>`,
      };

    case "DELIVERY_CONFIRMED":
      return {
        subject: `[${brand}] Livraison confirmée – ${orderName}`,
        html: `<p>La livraison de <b>${orderName}</b> est confirmée.</p>
<p><a href="${portalUrl}">Accéder au portail</a></p>`,
      };

    case "USER_INVITE": {
      // MVP: infos d’invitation
      const toName = String(ctx.toName ?? "").trim();
      const inviteLink = String(ctx.inviteLink ?? ctx.link ?? "").trim(); // tolérant si tu passes link
      const companyName = String(ctx.companyName ?? "").trim();

      return {
        subject: `[${brand}] Invitation Portail PRO`,
        html: `
<p>Bonjour ${toName || ""},</p>
<p>Vous avez été invité(e) à accéder au <b>Portail PRO Apertura</b>${companyName ? ` pour <b>${companyName}</b>` : ""}.</p>
<p><a href="${inviteLink}">Définir mon mot de passe</a></p>
<p>Ce lien est valable 24h.</p>
        `,
      };
    }

    default:
      // Sécurité runtime si jamais un event inconnu arrive
      return {
        subject: `[${brand}] Notification`,
        html: `<p>Notification</p><p><a href="${portalUrl}">Accéder au portail</a></p>`,
      };
  }
}
