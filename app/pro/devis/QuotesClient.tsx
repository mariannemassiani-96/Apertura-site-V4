"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteContent, labels } from "@/lib/content";
import { getCart, getQuotes, setCart, setQuotes } from "@/lib/proStorage";

export const QuotesClient = () => {
  const { quotes } = siteContent.pro;
  const [items, setItems] = useState(getQuotes());

  useEffect(() => {
    setItems(getQuotes());
  }, []);

  const update = (next: typeof items) => {
    setItems(next);
    setQuotes(next);
  };

  const addToCart = (id: string) => {
    const cart = getCart();
    if (!cart.includes(id)) {
      setCart([...cart, id]);
    }
    update(
      items.map((item) => (item.id === id ? { ...item, status: "in_cart" } : item)),
    );
  };

  const remove = (id: string) => {
    update(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ivoire">{quotes.title}</h1>
      {items.length === 0 ? (
        <p className="text-sm text-ivoire/60">{quotes.empty}</p>
      ) : (
        <div className="overflow-auto rounded-2xl border border-ivoire/10">
          <table className="min-w-full text-left text-sm text-ivoire/70">
            <thead className="bg-ivoire/5 text-xs uppercase tracking-wide text-ivoire/60">
              <tr>
                {quotes.columns.map((column) => (
                  <th key={column} className="px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-ivoire/10">
                  <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">{item.reference}</td>
                  <td className="px-4 py-3">{item.client}</td>
                  <td className="px-4 py-3">{item.city}</td>
                  <td className="px-4 py-3">{item.total.toFixed(2)} {labels.units.currency}</td>
                  <td className="px-4 py-3">
                    {item.status === "draft" ? quotes.status.draft : quotes.status.inCart}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <Link href={`/pro/devis/${item.id}`} className="text-xs text-cuivre">
                      {quotes.actions.view}
                    </Link>
                    <button
                      type="button"
                      className="text-xs text-ivoire/70"
                      onClick={() => addToCart(item.id)}
                    >
                      {quotes.actions.add}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-ivoire/40"
                      onClick={() => remove(item.id)}
                    >
                      {quotes.actions.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
