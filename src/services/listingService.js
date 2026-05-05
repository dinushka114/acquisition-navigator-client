import { api } from "../lib/api.js";
import { getToken } from "../lib/authStorage.js";

function qs(params) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== "" && v != null
  );
  if (!entries.length) return "";
  return `?${new URLSearchParams(entries).toString()}`;
}

/** @param {Record<string, string>} [params] */
export function fetchListings(params = {}) {
  const needsAuth = params.mine === "true" || params.mine === true;
  return api(`/api/listings${qs(params)}`, { auth: needsAuth });
}

export function fetchListing(id) {
  return api(`/api/listings/${id}`, { auth: !!getToken() });
}

export function trackListingView(id) {
  return api(`/api/listings/${id}/view`, { method: "POST" });
}

export function createListing(body) {
  return api("/api/listings", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}

export function updateListing(id, body) {
  return api(`/api/listings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export function deleteListing(id) {
  return api(`/api/listings/${id}`, { method: "DELETE", auth: true });
}

export function recalculateListingValuation(id) {
  return api(`/api/listings/${id}/valuation/recalculate`, {
    method: "POST",
    auth: true,
  });
}

export function uploadListingDocument(listingId, file) {
  const fd = new FormData();
  fd.append("file", file);
  return api(`/api/listings/${listingId}/documents`, {
    method: "POST",
    body: fd,
    auth: true,
  });
}

export function uploadListingCover(listingId, file) {
  const fd = new FormData();
  fd.append("file", file);
  return api(`/api/listings/${listingId}/cover`, {
    method: "POST",
    body: fd,
    auth: true,
  });
}

export function submitListingInquiry(listingId, body) {
  return api(`/api/listings/${listingId}/inquiry`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
