import type { LogoState } from "../types";

export const encodeState = (state: LogoState): string => {
  try {
    return btoa(JSON.stringify(state));
  } catch (e) {
    console.error("Błąd kodowania stanu do Base64", e);
    return "";
  }
};

export const decodeState = (encoded: string): Partial<LogoState> | null => {
  try {
    return JSON.parse(atob(encoded));
  } catch (e) {
    console.error("Błąd dekodowania stanu z Base64", e);
    return null;
  }
};

export const updateUrl = (encodedState: string) => {
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?d=${encodedState}`;
  window.history.replaceState({ path: newUrl }, "", newUrl);
};

export const getStateFromUrl = (): Partial<LogoState> | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const dataParam = urlParams.get("d");
  if (dataParam) {
    return decodeState(dataParam);
  }
  return null;
};
