export type Quote = {
  id: string;
  createdAt: string;
  reference: string;
  client: string;
  city: string;
  total: number;
  status: "draft" | "in_cart";
  details: Record<string, unknown>;
};

export type RequestItem = {
  id: string;
  createdAt: string;
  reference: string;
  type: "quote_request" | "quote_to_order";
  city: string;
  status: "reçue" | "en étude" | "besoin info" | "validée" | "commandée" | "clôturée";
  description: string;
  attachments: { name: string; size: number; type: string }[];
  emailSubject: string;
  emailBody: string;
  notes: string[];
};

export const STORAGE_KEYS = {
  quotes: "apertura_pro_quotes",
  cart: "apertura_pro_cart",
  requests: "apertura_pro_requests",
};

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getQuotes = (): Quote[] => {
  if (typeof window === "undefined") {
    return [];
  }
  return safeParse<Quote[]>(window.localStorage.getItem(STORAGE_KEYS.quotes), []);
};

export const setQuotes = (quotes: Quote[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
};

export const getCart = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }
  return safeParse<string[]>(window.localStorage.getItem(STORAGE_KEYS.cart), []);
};

export const setCart = (ids: string[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(ids));
};

export const getRequests = (): RequestItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  return safeParse<RequestItem[]>(window.localStorage.getItem(STORAGE_KEYS.requests), []);
};

export const setRequests = (requests: RequestItem[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(requests));
};
