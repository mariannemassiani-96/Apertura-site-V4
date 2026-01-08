"use client";

import { useMemo, useState } from "react";
import { siteContent, labels } from "@/lib/content";
import { calculateQuote } from "@/lib/priceMath";
import { getCart, getQuotes, setCart, setQuotes } from "@/lib/proStorage";

const createReference = (prefix: string) => `${prefix}-${Date.now().toString().slice(-6)}`;

export const ConfiguratorClient = () => {
  const { configurateur } = siteContent.pro;
  const [step, setStep] = useState(0);
  const [project, setProject] = useState({
    reference: createReference(configurateur.referencePrefix),
    client: "",
    city: "",
    notes: "",
  });
  const [config, setConfig] = useState({
    material: "aluminium",
    range: "Essentielle",
    family: "frappe",
    variant: "standard",
    width: 1200,
    height: 1200,
  });
  const [glass, setGlass] = useState({
    mode: "menuiserie",
    type: "standard",
  });
  const [options, setOptions] = useState({
    coloris: false,
    bicolor: false,
    securite: false,
    quincaillerie: false,
  });
  const [remise, setRemise] = useState(35);

  const quote = useMemo(
    () =>
      calculateQuote({
        material: config.material as "aluminium" | "pvc",
        width: config.width,
        height: config.height,
        glassMode: glass.mode as "menuiserie" | "menuiserie_vitrage" | "vitrage",
        glassType: glass.type as "standard" | "securit" | "acoustique",
        options,
        remise: remise as 35 | 30 | 25 | 0,
      }),
    [config, glass, options, remise],
  );

  const steps = configurateur.steps;

  const saveQuote = (status: "draft" | "in_cart") => {
    const quotes = getQuotes();
    const id = project.reference;
    const existingIndex = quotes.findIndex((item) => item.id === id);
    const payload = {
      id,
      createdAt: new Date().toISOString(),
      reference: project.reference,
      client: project.client,
      city: project.city,
      total: Number(quote.total.toFixed(2)),
      status,
      details: {
        project,
        config,
        glass,
        options,
        remise,
        quote,
      },
    };

    if (existingIndex >= 0) {
      const next = [...quotes];
      next[existingIndex] = payload;
      setQuotes(next);
      return;
    }
    setQuotes([...quotes, payload]);
  };

  const addToCart = () => {
    saveQuote("in_cart");
    const cart = getCart();
    if (!cart.includes(project.reference)) {
      setCart([...cart, project.reference]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ivoire">{configurateur.title}</h1>
        <div className="text-xs uppercase tracking-wide text-ivoire/50">
          {steps[step]}
        </div>
      </div>

      <div className="rounded-2xl border border-ivoire/10 p-6">
        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
              value={project.reference}
              onChange={(event) => setProject({ ...project, reference: event.target.value })}
              placeholder={configurateur.fields.reference}
              aria-label={configurateur.fields.reference}
            />
            <input
              className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
              value={project.client}
              onChange={(event) => setProject({ ...project, client: event.target.value })}
              placeholder={configurateur.fields.client}
              aria-label={configurateur.fields.client}
            />
            <input
              className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
              value={project.city}
              onChange={(event) => setProject({ ...project, city: event.target.value })}
              placeholder={configurateur.fields.city}
              aria-label={configurateur.fields.city}
            />
            <textarea
              className="md:col-span-2 min-h-[140px] rounded-2xl border border-ivoire/20 bg-transparent px-5 py-4 text-sm text-ivoire"
              value={project.notes}
              onChange={(event) => setProject({ ...project, notes: event.target.value })}
              placeholder={configurateur.fields.notes}
              aria-label={configurateur.fields.notes}
            />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.material}
              <select
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
                value={config.material}
                onChange={(event) => setConfig({ ...config, material: event.target.value })}
              >
                {configurateur.optionValues.materials.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.range}
              <select
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
                value={config.range}
                onChange={(event) => setConfig({ ...config, range: event.target.value })}
              >
                {configurateur.optionValues.ranges.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.family}
              <select
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
                value={config.family}
                onChange={(event) => setConfig({ ...config, family: event.target.value })}
              >
                {configurateur.optionValues.families.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.variant}
              <select
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
                value={config.variant}
                onChange={(event) => setConfig({ ...config, variant: event.target.value })}
              >
                {configurateur.optionValues.variants.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.width}
              <input
                type="number"
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-transparent px-4 py-2 text-sm text-ivoire"
                value={config.width}
                onChange={(event) => setConfig({ ...config, width: Number(event.target.value) })}
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.height}
              <input
                type="number"
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-transparent px-4 py-2 text-sm text-ivoire"
                value={config.height}
                onChange={(event) => setConfig({ ...config, height: Number(event.target.value) })}
              />
            </label>
            <div className="md:col-span-2 text-xs text-ivoire/60">
              {configurateur.fields.surface} : {quote.surface.toFixed(2)} {labels.units.squareMeter}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.glassMode}
              <select
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
                value={glass.mode}
                onChange={(event) => setGlass({ ...glass, mode: event.target.value })}
              >
                {configurateur.optionValues.glassModes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.glassType}
              <select
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
                value={glass.type}
                onChange={(event) => setGlass({ ...glass, type: event.target.value })}
              >
                {configurateur.optionValues.glassTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { key: "coloris", label: configurateur.optionLabels.coloris },
              { key: "bicolor", label: configurateur.optionLabels.bicolor },
              { key: "securite", label: configurateur.optionLabels.securite },
              { key: "quincaillerie", label: configurateur.optionLabels.quincaillerie },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-3 text-sm text-ivoire/80">
                <input
                  type="checkbox"
                  checked={options[item.key as keyof typeof options]}
                  onChange={(event) =>
                    setOptions({
                      ...options,
                      [item.key]: event.target.checked,
                    })
                  }
                />
                {item.label}
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4">
            <label className="text-xs uppercase tracking-wide text-ivoire/60">
              {configurateur.fields.remise}
              <select
                className="mt-2 w-full rounded-full border border-ivoire/20 bg-graphite px-4 py-2 text-sm text-ivoire"
                value={remise}
                onChange={(event) => setRemise(Number(event.target.value))}
              >
                {configurateur.optionValues.remises.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3 text-sm text-ivoire/70">
            <div className="flex justify-between">
              <span>{configurateur.fields.summary.surface}</span>
              <span>{quote.surface.toFixed(2)} {labels.units.squareMeter}</span>
            </div>
            <div className="flex justify-between">
              <span>{configurateur.fields.summary.menuiserie}</span>
              <span>{quote.menuiserieSubtotal.toFixed(2)} {labels.units.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>{configurateur.fields.summary.vitrage}</span>
              <span>{quote.glassSubtotal.toFixed(2)} {labels.units.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>{configurateur.fields.summary.options}</span>
              <span>{quote.optionsSubtotal.toFixed(2)} {labels.units.currency}</span>
            </div>
            <div className="flex justify-between text-ivoire">
              <span>{configurateur.fields.summary.remise}</span>
              <span>-{(quote.discountRate * 100).toFixed(0)} %</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ivoire">
              <span>{configurateur.fields.summary.total}</span>
              <span>{quote.total.toFixed(2)} {labels.units.currency}</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-ivoire/50">{configurateur.disclaimer}</p>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              className="rounded-full border border-ivoire/20 px-4 py-2 text-xs uppercase tracking-wide text-ivoire/70"
              onClick={() => setStep((prev) => prev - 1)}
            >
              {labels.actions.previous}
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              className="rounded-full bg-ivoire/10 px-4 py-2 text-xs uppercase tracking-wide text-ivoire"
              onClick={() => setStep((prev) => prev + 1)}
            >
              {labels.actions.next}
            </button>
          )}
        </div>
        {step === steps.length - 1 && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-ivoire/30 px-4 py-2 text-xs uppercase tracking-wide text-ivoire"
              onClick={() => saveQuote("draft")}
            >
              {configurateur.actions.save}
            </button>
            <button
              type="button"
              className="rounded-full bg-cuivre px-4 py-2 text-xs uppercase tracking-wide text-graphite"
              onClick={addToCart}
            >
              {configurateur.actions.addToCart}
            </button>
            <button
              type="button"
              className="rounded-full border border-cuivre px-4 py-2 text-xs uppercase tracking-wide text-cuivre"
              onClick={() => window.print()}
            >
              {configurateur.actions.print}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
