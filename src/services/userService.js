import { api } from "../lib/api.js";

export function fetchMe() {
  return api("/api/auth/me", { auth: true });
}

export function updateMe(body) {
  return api("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export function uploadMyAvatar(file) {
  const form = new FormData();
  form.append("avatar", file);
  return api("/api/users/me/avatar", {
    method: "POST",
    body: form,
    auth: true,
  });
}

export function updateSearchPreferences(body) {
  return api("/api/users/me/search-preferences", {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}
