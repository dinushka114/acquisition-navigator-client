import { api } from "../lib/api.js";

export function fetchThreads() {
  return api("/api/messages/threads", { auth: true });
}

export function createThread(body) {
  return api("/api/messages/threads", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}

export function fetchMessages(threadId, params = {}) {
  const q = new URLSearchParams(params).toString();
  return api(`/api/messages/threads/${threadId}/messages${q ? `?${q}` : ""}`, {
    auth: true,
  });
}

export function sendMessage(threadId, body) {
  return api(`/api/messages/threads/${threadId}/messages`, {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}

/**
 * Upload a file attachment for a thread.
 * Returns { attachment: { url, fileName, mimeType } }
 */
export function uploadMessageAttachment(threadId, file) {
  const fd = new FormData();
  fd.append("file", file);
  return api(`/api/messages/threads/${threadId}/attachments`, {
    method: "POST",
    body: fd,
    auth: true,
  });
}
