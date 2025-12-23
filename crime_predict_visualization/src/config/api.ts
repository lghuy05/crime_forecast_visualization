const DEFAULT_API_BASE_URL = "http://localhost:8000";

const resolveDefaultBaseUrl = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_API_BASE_URL;
  }

  const { hostname, origin } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return DEFAULT_API_BASE_URL;
  }

  return origin;
};

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || resolveDefaultBaseUrl();
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
