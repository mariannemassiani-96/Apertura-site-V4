"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { siteContent, labels } from "@/lib/content";
import { getRequests, setRequests } from "@/lib/proStorage";

export const RequestDetailClient = ({ id }: { id: string }) => {
  const router = useRouter();
  const { requests } = siteContent.pro;
  const [item, setItem] = useState(() => getRequests().find((entry) => entry.id === id));
  const [note, setNote] = useState("");

  useEffect(() => {
    setItem(getRequests().find((entry) => entry.id === id));
  }, [id]);

  if (!item) {
    return <p className="text-sm text-ivoire/60">{requests.empty}</p>;
  }

  const updateRequest = (updates: Partial<typeof item>) => {
    const next = getRequests().map((entry) => (entry.id === item.id ? { ...entry, ...updates } : entry));
    setRequests(next);
    setItem({ ...item, ...updates });
  };

  const addNote = () => {
    if (!note.trim()) {
      return;
    }
    updateRequest({ notes: [...item.notes, note.trim()] });
    setNote("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ivoire">{item.reference}</h1>
        <p className="text-sm text-ivoire/60">{item.city}</p>
      </div>
      <div className="rounded-2xl border border-ivoire/10 p-6 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-ivoire/50">{requests.detail.summary}</div>
          <p className="mt-2 text-sm text-ivoire/70">{item.description}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-ivoire/50">{requests.detail.files}</div>
          <ul className="mt-2 space-y-1 text-sm text-ivoire/70">
            {item.attachments.length === 0 ? (
              <li>{labels.symbols.placeholder}</li>
            ) : (
              item.attachments.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))
            )}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-ivoire/50">{requests.detail.status}</div>
          <select
            className="mt-2 rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
            value={item.status}
            onChange={(event) => updateRequest({ status: event.target.value as typeof item.status })}
          >
            {requests.statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-2xl border border-ivoire/10 p-6 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-ivoire/50">{requests.detail.emailSubject}</div>
          <p className="mt-2 text-sm text-ivoire/70 break-all">{item.emailSubject}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-ivoire/50">{requests.detail.emailBody}</div>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-ivoire/70">{item.emailBody}</pre>
        </div>
      </div>
      <div className="rounded-2xl border border-ivoire/10 p-6 space-y-4">
        <div className="text-xs uppercase tracking-wide text-ivoire/50">{requests.detail.notes}</div>
        <ul className="space-y-1 text-sm text-ivoire/70">
          {item.notes.length === 0
            ? <li>{labels.symbols.placeholder}</li>
            : item.notes.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
        </ul>
        <div className="flex flex-wrap gap-3">
          <input
            className="flex-1 rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={requests.detail.addNote}
            aria-label={requests.detail.addNote}
          />
          <button
            type="button"
            className="rounded-full bg-cuivre px-4 py-2 text-xs uppercase tracking-wide text-graphite"
            onClick={addNote}
          >
            {requests.detail.addNote}
          </button>
        </div>
      </div>
      <button
        type="button"
        className="rounded-full border border-ivoire/20 px-4 py-2 text-xs uppercase tracking-wide text-ivoire/60"
        onClick={() => router.push("/pro/demandes")}
      >
        {labels.actions.back}
      </button>
    </div>
  );
};
