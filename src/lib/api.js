import { getToken } from "./authStorage.js";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function buildErrorMessage(data, status) {
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.errors) && data.errors[0]?.msg) {
    return data.errors.map((e) => e.msg).join(". ");
  }
  return `Request failed (${status})`;
}

/**
 * @param {string} path - e.g. /api/auth/login
 * @param {RequestInit & { auth?: boolean }} options - set auth: true to send Bearer token from storage
 */
export async function api(path, options = {}) {
  const { auth = false, headers: optHeaders, body, ...rest } = options;
  const headers = new Headers(optHeaders);

  if (body !== undefined && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers,
    body,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    throw new Error(buildErrorMessage(data, res.status));
  }

  return data;
}

export { baseUrl };
