const DEFAULT_API_BASE_URL = "http://localhost:8000";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

export const API_BASE_URL = normalizedBaseUrl;

export const buildApiUrl = (path: string): string => {
  if (!path) {
    return API_BASE_URL;
  }

  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/${path}`;
};
