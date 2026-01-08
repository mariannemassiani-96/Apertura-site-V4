import pricebook from "@/data/pricebook.v0.json";

export type QuoteInput = {
  material: "aluminium" | "pvc";
  width: number;
  height: number;
  glassMode: "menuiserie" | "menuiserie_vitrage" | "vitrage";
  glassType: "standard" | "securit" | "acoustique";
  options: {
    coloris: boolean;
    bicolor: boolean;
    securite: boolean;
    quincaillerie: boolean;
  };
  remise: 35 | 30 | 25 | 0;
};

export type QuoteOutput = {
  surface: number;
  menuiserieSubtotal: number;
  glassSubtotal: number;
  optionsSubtotal: number;
  discountRate: number;
  total: number;
};

export const calculateQuote = (input: QuoteInput): QuoteOutput => {
  const surface = (input.width * input.height) / 1_000_000;
  const materialRate = pricebook.materials[input.material].baseRate;
  const baseMenuiserie = surface * materialRate;
  const glassBase = pricebook.glass[input.glassType];

  const includesGlass = pricebook.materials[input.material].includesGlass;
  const glassSubtotal =
    input.glassMode === "vitrage"
      ? surface * (materialRate * 0.35 + glassBase)
      : input.glassMode === "menuiserie_vitrage"
        ? surface * (includesGlass ? glassBase : materialRate * 0.3 + glassBase)
        : 0;

  const optionsSubtotal =
    (input.options.coloris ? pricebook.options.coloris : 0) +
    (input.options.securite ? pricebook.options.securite : 0) +
    (input.options.quincaillerie ? pricebook.options.quincaillerie : 0);

  const bicolorMultiplier = input.options.bicolor ? 1.05 : 1;
  const menuiserieSubtotal = baseMenuiserie * bicolorMultiplier;
  const discountRate = input.remise / 100;
  const total = (menuiserieSubtotal + glassSubtotal + optionsSubtotal) * (1 - discountRate);

  return {
    surface,
    menuiserieSubtotal,
    glassSubtotal,
    optionsSubtotal,
    discountRate,
    total,
  };
};
