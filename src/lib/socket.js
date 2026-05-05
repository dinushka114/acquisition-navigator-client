import { io } from "socket.io-client";
import { getToken } from "./authStorage.js";

const SERVER_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  (import.meta.env.DEV ? "http://localhost:5001" : window.location.origin);

let socket = null;

export function getSocket() {
  if (socket) return socket;

  socket = io(SERVER_URL, {
    autoConnect: false,
    auth: { token: getToken() },
    transports: ["websocket", "polling"],
  });

  return socket;
}


export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}


export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
