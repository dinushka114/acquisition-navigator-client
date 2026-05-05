import { api } from "../lib/api.js";

export function login(email, password) {
  return api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * @param {{ email: string, password: string, role: 'buyer' | 'seller', fullName?: string, phone?: string, nicOrPassport?: string }} payload
 */
export function register(payload) {
  return api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
