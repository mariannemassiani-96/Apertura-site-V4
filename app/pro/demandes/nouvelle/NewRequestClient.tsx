"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteContent, labels } from "@/lib/content";
import { getRequests, setRequests } from "@/lib/proStorage";

const createReference = (prefix: string) => `${prefix}-${Date.now().toString().slice(-6)}`;

export const NewRequestClient = () => {
  const router = useRouter();
  const { requests } = siteContent.pro;
  const [type, setType] = useState<"quote_request" | "quote_to_order">("quote_request");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [client, setClient] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [families, setFamilies] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState(requests.urgencyOptions[0].value);
  const [files, setFiles] = useState<File[]>([]);

  const toggleValue = (value: string, list: string[], setter: (next: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
      return;
    }
    setter([...list, value]);
  };

  const buildEmailBody = (reference: string, id: string) => {
    const fields = requests.email.fields;
    const attachments = files
      .map((file) => `- ${file.name} (${file.size} ${labels.units.bytes}, ${file.type || ""})`)
      .join("\n");

    return [
      requests.email.bodyStart,
      `${fields.requestId}: ${id}`,
      `${fields.reference}: ${reference}`,
      `${fields.type}: ${type}`,
      `${fields.accountEmail}: ${clientEmail || ""}`,
      `${fields.createdAt}: ${new Date().toISOString()}`,
      "",
      `${fields.siteCity}: ${city}`,
      `${fields.siteAddress}: ${address}`,
      `${fields.clientName}: ${client}`,
      `${fields.clientPhone}: ${clientPhone}`,
      `${fields.clientEmail}: ${clientEmail}`,
      "",
      `${fields.materials}: ${materials.join(",")}`,
      `${fields.families}: ${families.join(",")}`,
      `${fields.urgency}: ${urgency}`,
      "",
      `${fields.freeNotes}:`,
      description,
      "",
      `${fields.attachments}:`,
      attachments || labels.symbols.placeholder,
      requests.email.bodyEnd,
    ].join("\n");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ivoire">{requests.newTitle}</h1>
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          const id = createReference(requests.referencePrefix);
          const reference = id;
          const subject = `${requests.email.subjectPrefix} ${reference}${requests.email.subjectSeparator}${type}${requests.email.subjectSeparator}${city}`;
          const body = buildEmailBody(reference, id);
          import type { RequestItem } from "@/lib/pro/types"; // adapte le chemin exact

...

          const newItem: RequestItem = {
          id,
          createdAt: new Date().toISOString(),
          reference,
          type,
          city,
          status: "reçue",
          description,
          attachments,
          emailSubject,
          emailBody,
          notes: [],
        };

        const next: RequestItem[] = [...requests, newItem];
        setRequests(next);
        router.push(`/pro/demandes/${id}`);

          setRequests(next);
          router.push(`/pro/demandes/${id}`);
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-ivoire/60">
            {requests.types.quote}
            <input
              type="radio"
              name="request-type"
              checked={type === "quote_request"}
              onChange={() => setType("quote_request")}
              className="ml-2"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-ivoire/60">
            {requests.types.order}
            <input
              type="radio"
              name="request-type"
              checked={type === "quote_to_order"}
              onChange={() => setType("quote_to_order")}
              className="ml-2"
            />
          </label>
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requests.form.site}
            aria-label={requests.form.site}
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requests.form.address}
            aria-label={requests.form.address}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requests.form.client}
            aria-label={requests.form.client}
            value={client}
            onChange={(event) => setClient(event.target.value)}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requests.form.clientEmail}
            aria-label={requests.form.clientEmail}
            value={clientEmail}
            onChange={(event) => setClientEmail(event.target.value)}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requests.form.clientPhone}
            aria-label={requests.form.clientPhone}
            value={clientPhone}
            onChange={(event) => setClientPhone(event.target.value)}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-ivoire/60">{requests.form.materials}</div>
            {requests.materialsOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-ivoire/70">
                <input
                  type="checkbox"
                  checked={materials.includes(option.value)}
                  onChange={() => toggleValue(option.value, materials, setMaterials)}
                />
                {option.label}
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-ivoire/60">{requests.form.families}</div>
            {requests.familyOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-ivoire/70">
                <input
                  type="checkbox"
                  checked={families.includes(option.value)}
                  onChange={() => toggleValue(option.value, families, setFamilies)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
        <textarea
          className="min-h-[160px] w-full rounded-2xl border border-ivoire/20 bg-transparent px-5 py-4 text-sm text-ivoire"
          placeholder={requests.form.description}
          aria-label={requests.form.description}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-ivoire/60">
            {requests.form.urgency}
            <select
              className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
              value={urgency}
              onChange={(event) => setUrgency(event.target.value)}
            >
              {requests.urgencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-ivoire/60">
            {requests.form.upload}
            <input
              type="file"
              multiple
              className="mt-2 w-full text-xs text-ivoire/70"
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-cuivre px-6 py-3 text-xs uppercase tracking-wide text-graphite"
          >
            {requests.form.submit}
          </button>
          <button
            type="button"
            className="rounded-full border border-ivoire/30 px-6 py-3 text-xs uppercase tracking-wide text-ivoire"
            onClick={() => router.push("/pro/demandes")}
          >
            {labels.actions.back}
          </button>
        </div>
      </form>
    </div>
  );
};
