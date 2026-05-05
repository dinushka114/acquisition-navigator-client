import { api } from "../lib/api.js";

export function submitContact(body) {
  return api("/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
