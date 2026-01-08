"use client";

import { useEffect, useState } from "react";
import { siteContent, labels } from "@/lib/content";
import { getCart, getQuotes, setCart } from "@/lib/proStorage";

export const CartClient = () => {
  const { cart } = siteContent.pro;
  const [items, setItems] = useState(() => {
    const cartIds = getCart();
    return getQuotes().filter((quote) => cartIds.includes(quote.id));
  });

  useEffect(() => {
    const cartIds = getCart();
    setItems(getQuotes().filter((quote) => cartIds.includes(quote.id)));
  }, []);

  const total = items.reduce((sum, item) => sum + item.total, 0);

  const removeFromCart = (id: string) => {
    const nextCart = getCart().filter((item) => item !== id);
    setCart(nextCart);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ivoire">{cart.title}</h1>
      {items.length === 0 ? (
        <p className="text-sm text-ivoire/60">{cart.empty}</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-ivoire/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-ivoire">{item.reference}</div>
                  <div className="text-xs text-ivoire/60">{item.client}</div>
                </div>
                <div className="text-sm text-ivoire/80">{item.total.toFixed(2)} {labels.units.currency}</div>
                <button
                  type="button"
                  className="text-xs text-ivoire/50"
                  onClick={() => removeFromCart(item.id)}
                >
                  {siteContent.pro.quotes.actions.delete}
                </button>
              </div>
            </div>
          ))}
          <div className="text-sm text-ivoire/70">
            {cart.summary}: {total.toFixed(2)} {labels.units.currency}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-cuivre px-4 py-2 text-xs uppercase tracking-wide text-graphite"
            >
              {cart.actions.request}
            </button>
            <button
              type="button"
              className="rounded-full border border-cuivre px-4 py-2 text-xs uppercase tracking-wide text-cuivre"
              onClick={() => window.print()}
            >
              {cart.actions.print}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
