"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteContent, labels } from "@/lib/content";
import { getRequests, setRequests } from "@/lib/proStorage";
import type { RequestItem } from "@/lib/pro/types";

/**
 * Génère une référence simple basée sur le timestamp
 */
const createReference = (prefix: string) =>
  `${prefix}-${Date.now().toString().slice(-6)}`;

export const NewRequestClient = () => {
  const router = useRouter();

  // ⚠️ requestsUI = contenu éditorial (labels, textes)
  const { requests: requestsUI } = siteContent.pro;

  // ----------------------------
  // STATE FORMULAIRE
  // ----------------------------
  const [type, setType] = useState<"quote_request" | "quote_to_order">(
    "quote_request"
  );
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [client, setClient] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [families, setFamilies] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState(
    requestsUI.urgencyOptions[0].value
  );
  const [files, setFiles] = useState<File[]>([]);

  // ----------------------------
  // HELPERS
  // ----------------------------
  const toggleValue = (
    value: string,
    list: string[],
    setter: (next: string[]) => void
  ) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
      return;
    }
    setter([...list, value]);
  };

  const buildEmailBody = (reference: string, id: string) => {
    const fields = requestsUI.email.fields;
    const attachments = files
      .map(
        (file) =>
          `- ${file.name} (${file.size} ${labels.units.bytes}, ${
            file.type || ""
          })`
      )
      .join("\n");

    return [
      requestsUI.email.bodyStart,
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
      `${fields.materials}: ${materials.join(", ")}`,
      `${fields.families}: ${families.join(", ")}`,
      `${fields.urgency}: ${urgency}`,
      "",
      `${fields.freeNotes}:`,
      description,
      "",
      `${fields.attachments}:`,
      attachments || labels.symbols.placeholder,
      requestsUI.email.bodyEnd,
    ].join("\n");
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ivoire">
        {requestsUI.newTitle}
      </h1>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();

          // 🔹 Récupère les demandes existantes
          const existing = getRequests();

          // 🔹 Identifiants
          const id = createReference(requestsUI.referencePrefix);
          const reference = id;

          // 🔹 Email
          const emailSubject = `${requestsUI.email.subjectPrefix} ${reference}${requestsUI.email.subjectSeparator}${type}${requestsUI.email.subjectSeparator}${city}`;
          const emailBody = buildEmailBody(reference, id);

          // 🔹 Fichiers → métadonnées (localStorage safe)
          const attachments = files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type || "",
          }));

          // 🔹 Nouvelle demande (TYPÉE)
          const initialStatus: RequestItem["status"] = "reçue";
          const newItem: RequestItem = {
            id,
            createdAt: new Date().toISOString(),
            reference,
            type,
            city,
            status: "reçue" as RequestItem["status"],
            description,
            attachments,
            emailSubject,
            emailBody,
            notes: [],
          };

          const next: RequestItem[] = [...existing, newItem];
          setRequests(next);

          router.push(`/pro/demandes/${id}`);
        }}
      >
        {/* TYPE */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-ivoire/60">
            {requestsUI.types.quote}
            <input
              type="radio"
              name="request-type"
              checked={type === "quote_request"}
              onChange={() => setType("quote_request")}
              className="ml-2"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-ivoire/60">
            {requestsUI.types.order}
            <input
              type="radio"
              name="request-type"
              checked={type === "quote_to_order"}
              onChange={() => setType("quote_to_order")}
              className="ml-2"
            />
          </label>
        </div>

        {/* INFOS CHANTIER / CLIENT */}
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requestsUI.form.site}
            aria-label={requestsUI.form.site}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requestsUI.form.address}
            aria-label={requestsUI.form.address}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requestsUI.form.client}
            aria-label={requestsUI.form.client}
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requestsUI.form.clientEmail}
            aria-label={requestsUI.form.clientEmail}
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={requestsUI.form.clientPhone}
            aria-label={requestsUI.form.clientPhone}
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </div>

        {/* MATÉRIAUX / FAMILLES */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-ivoire/60">
              {requestsUI.form.materials}
            </div>
            {requestsUI.materialsOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-ivoire/70"
              >
                <input
                  type="checkbox"
                  checked={materials.includes(option.value)}
                  onChange={() =>
                    toggleValue(option.value, materials, setMaterials)
                  }
                />
                {option.label}
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-ivoire/60">
              {requestsUI.form.families}
            </div>
            {requestsUI.familyOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-ivoire/70"
              >
                <input
                  type="checkbox"
                  checked={families.includes(option.value)}
                  onChange={() =>
                    toggleValue(option.value, families, setFamilies)
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <textarea
          className="min-h-[160px] w-full rounded-2xl border border-ivoire/20 bg-transparent px-5 py-4 text-sm text-ivoire"
          placeholder={requestsUI.form.description}
          aria-label={requestsUI.form.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* URGENCE + UPLOAD */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-ivoire/60">
            {requestsUI.form.urgency}
            <select
              className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
            >
              {requestsUI.urgencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs uppercase tracking-wide text-ivoire/60">
            {requestsUI.form.upload}
            <input
              type="file"
              multiple
              className="mt-2 w-full text-xs text-ivoire/70"
              onChange={(e) =>
                setFiles(Array.from(e.target.files ?? []))
              }
            />
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-cuivre px-6 py-3 text-xs uppercase tracking-wide text-graphite"
          >
            {requestsUI.form.submit}
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
