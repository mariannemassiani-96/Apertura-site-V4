"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { siteContent, labels } from "@/lib/content";
import { getCart, getQuotes, setCart, setQuotes } from "@/lib/proStorage";
import type { Quote } from "@/lib/proStorage";

export const QuoteDetailClient = ({ id }: { id: string }) => {
  const router = useRouter();

  const [quote, setQuote] = useState<Quote | undefined>(() =>
    getQuotes().find((item) => item.id === id)
  );

  const { configurateur, quotes } = siteContent.pro;

  useEffect(() => {
    setQuote(getQuotes().find((item) => item.id === id));
  }, [id]);

  if (!quote) {
    return <p className="text-sm text-ivoire/60">{quotes.empty}</p>;
  }

  const addToCart = () => {
    const cart = getCart();
    if (!cart.includes(quote.id)) {
      setCart([...cart, quote.id]);
    }

    const existing: Quote[] = getQuotes();
    const next: Quote[] = existing.map((item) =>
      item.id === quote.id ? { ...item, status: "in_cart" } : item
    );

    setQuotes(next);
    setQuote({ ...quote, status: "in_cart" });
  };

  const remove = () => {
    const existing: Quote[] = getQuotes();
    const next: Quote[] = existing.filter((item) => item.id !== quote.id);
    setQuotes(next);
    router.push("/pro/devis");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ivoire">{quote.reference}</h1>
        <p className="text-sm text-ivoire/60">{quote.client}</p>
      </div>

      <div className="rounded-2xl border border-ivoire/10 p-6 text-sm text-ivoire/70">
        <pre className="whitespace-pre-wrap">{JSON.stringify(quote.details, null, 2)}</pre>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-cuivre px-4 py-2 text-xs uppercase tracking-wide text-graphite"
          onClick={addToCart}
        >
          {configurateur.actions.addToCart}
        </button>

        <button
          type="button"
          className="rounded-full border border-ivoire/30 px-4 py-2 text-xs uppercase tracking-wide text-ivoire"
          onClick={() => window.print()}
        >
          {configurateur.actions.print}
        </button>

        <button
          type="button"
          className="rounded-full border border-ivoire/20 px-4 py-2 text-xs uppercase tracking-wide text-ivoire/60"
          onClick={remove}
        >
          {quotes.actions.delete}
        </button>

        <button
          type="button"
          className="rounded-full border border-ivoire/20 px-4 py-2 text-xs uppercase tracking-wide text-ivoire/60"
          onClick={() => router.push("/pro/devis")}
        >
          {labels.actions.back}
        </button>
      </div>
    </div>
  );
};
