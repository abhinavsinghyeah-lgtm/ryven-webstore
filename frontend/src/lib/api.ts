const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
}

function normalizeApiBase(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function getApiBase() {
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";
    if (isLocal && API_BASE) {
      return normalizeApiBase(API_BASE);
    }
    return `${origin}/api/v1`;
  }

  const configuredBase = API_BASE;

  if (!configuredBase) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  return normalizeApiBase(configuredBase);
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    const fieldErrors = data?.details?.fieldErrors
      ? Object.entries(data.details.fieldErrors)
          .flatMap(([field, messages]) =>
            Array.isArray(messages)
              ? messages.filter(Boolean).map((message) => `${field}: ${String(message)}`)
              : [],
          )
          .join(" | ")
      : "";

    const message = [data?.message || "Request failed", fieldErrors].filter(Boolean).join(" - ");
    const error = new Error(message) as Error & { status?: number; data?: unknown };
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
