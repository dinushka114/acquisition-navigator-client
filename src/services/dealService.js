import { api } from "../lib/api.js";

export function createDeal(listingId) {
  return api("/api/deals", {
    method: "POST",
    body: JSON.stringify({ listingId }),
    auth: true,
  });
}

export function fetchDeals() {
  return api("/api/deals", { auth: true });
}

export function fetchDeal(id) {
  return api(`/api/deals/${id}`, { auth: true });
}

export function updateDeal(id, body) {
  return api(`/api/deals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export function addDealTask(id, body) {
  return api(`/api/deals/${id}/tasks`, {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}

export function updateDealTask(dealId, taskId, body) {
  return api(`/api/deals/${dealId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export function addDealNote(id, body) {
  return api(`/api/deals/${id}/notes`, {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}
