"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteContent } from "@/lib/content";
import { getQuotes, getRequests } from "@/lib/proStorage";

export const DashboardClient = () => {
  const { dashboard } = siteContent.pro;
  const [recentQuotes, setRecentQuotes] = useState<string[]>([]);
  const [recentRequests, setRecentRequests] = useState<string[]>([]);

  useEffect(() => {
    const quotes = getQuotes().slice(-3).map((quote) => quote.reference);
    const requests = getRequests().slice(-3).map((request) => request.reference);
    setRecentQuotes(quotes);
    setRecentRequests(requests);
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-ivoire">{dashboard.title}</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {dashboard.actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-2xl border border-ivoire/10 p-5 text-sm text-ivoire/80 transition hover:border-cuivre/60"
            >
              {action.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-ivoire/10 p-6">
        <h2 className="text-sm uppercase tracking-wide text-ivoire/60">{dashboard.recent}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-ivoire/50">{dashboard.recentQuotesLabel}</div>
            <ul className="mt-2 space-y-1 text-sm text-ivoire/80">
              {recentQuotes.length === 0
                ? <li className="text-ivoire/50">{dashboard.recentQuotesEmpty}</li>
                : recentQuotes.map((quote) => <li key={quote}>{quote}</li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-ivoire/50">{dashboard.recentRequestsLabel}</div>
            <ul className="mt-2 space-y-1 text-sm text-ivoire/80">
              {recentRequests.length === 0
                ? <li className="text-ivoire/50">{dashboard.recentRequestsEmpty}</li>
                : recentRequests.map((request) => <li key={request}>{request}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
