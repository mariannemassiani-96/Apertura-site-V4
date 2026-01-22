export type NotifyEvent =
  | "SIGNATURE_REQUIRED"
  | "ORDER_SIGNED"
  | "DEPOSIT_REQUIRED"
  | "DEPOSIT_RECEIVED"
  | "DELIVERY_CONFIRMED";

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
  }
}
