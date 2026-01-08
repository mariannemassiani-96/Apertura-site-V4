"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteContent } from "@/lib/content";
import { getRequests } from "@/lib/proStorage";

export const RequestsClient = () => {
  const { requests } = siteContent.pro;
  const [items, setItems] = useState(getRequests());

  useEffect(() => {
    setItems(getRequests());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ivoire">{requests.title}</h1>
        <Link
          href="/pro/demandes/nouvelle"
          className="rounded-full border border-cuivre px-4 py-2 text-xs uppercase tracking-wide text-cuivre"
        >
          {requests.newTitle}
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-ivoire/60">{requests.empty}</p>
      ) : (
        <div className="overflow-auto rounded-2xl border border-ivoire/10">
          <table className="min-w-full text-left text-sm text-ivoire/70">
            <thead className="bg-ivoire/5 text-xs uppercase tracking-wide text-ivoire/60">
              <tr>
                {requests.columns.map((column) => (
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
                  <td className="px-4 py-3">
                    {item.type === "quote_request" ? requests.types.quote : requests.types.order}
                  </td>
                  <td className="px-4 py-3">{item.city}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">
                    <Link href={`/pro/demandes/${item.id}`} className="text-xs text-cuivre">
                      {siteContent.pro.quotes.actions.view}
                    </Link>
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
