export const AUTH_TOKEN_KEY = "apertura_pro_token";

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  return Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY));
};

export const login = (email: string, password: string): boolean => {
  if (!email || !password) {
    return false;
  }
  if (typeof window === "undefined") {
    return false;
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, email);
  return true;
};

export const logout = (): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};
