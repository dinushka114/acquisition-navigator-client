import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ProtectedRoute } from "../../components/Routing/ProtectedRoute.jsx";
import { fetchThreads, fetchMessages, sendMessage, uploadMessageAttachment } from "../../services/messageService.js";
import { getUser } from "../../lib/authStorage.js";
import { connectSocket, destroySocket } from "../../lib/socket.js";

function MessagesContent() {
  const [searchParams] = useSearchParams();
  const initialThread = searchParams.get("thread");
  const me = getUser()?.id;

  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(initialThread || null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Attachment state
  const [pendingFile, setPendingFile] = useState(null);   // File object
  const [pendingPreview, setPendingPreview] = useState(null); // blob URL or null
  const fileInputRef = useRef(null);

  // Mobile responsiveness state
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);

  // Keep a ref so our socket listener always sees the latest activeId
  const activeIdRef = useRef(activeId);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  // ── 1. Load thread list & connect socket on mount ──────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetchThreads();
        if (cancelled) return;
        const list = res.data || [];
        setThreads(list);
        setActiveId((prev) => prev || initialThread || list[0]?._id || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    // Connect socket and register the message:new listener
    const socket = connectSocket();

    function onMessageNew(msg) {
      const threadId = msg.thread?._id ?? msg.thread;

      // Append to messages if this event belongs to the open thread
      if (threadId && String(threadId) === String(activeIdRef.current)) {
        setMessages((prev) => {
          // Avoid duplicates (e.g. optimistic + server echo)
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }

      // Update the sidebar's lastMessageAt so threads re-sort
      setThreads((prev) =>
        prev.map((t) =>
          String(t._id) === String(threadId)
            ? { ...t, lastMessageAt: msg.createdAt || new Date().toISOString() }
            : t
        )
      );
    }

    socket.on("message:new", onMessageNew);

    return () => {
      cancelled = true;
      socket.off("message:new", onMessageNew);
      destroySocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialThread]);

  // ── 2. Load history & join room whenever the active thread changes ─────────
  useEffect(() => {
    if (!activeId) return;

    // Fetch message history
    (async () => {
      try {
        const res = await fetchMessages(activeId, { limit: "80" });
        setMessages(res.data || []);
      } catch {
        setMessages([]);
      }
    })();

    // Join the Socket.IO room so we receive live messages for this thread
    const socket = connectSocket();
    socket.emit("thread:join", activeId);
  }, [activeId]);

  // ── 3. Send message ────────────────────────────────────────────────────────────────
  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      if (!activeId || (!body.trim() && !pendingFile)) return;
      setSending(true);
      try {
        let attachments = [];
        if (pendingFile) {
          const res = await uploadMessageAttachment(activeId, pendingFile);
          if (res.attachment) attachments = [res.attachment];
          // Release blob URL
          URL.revokeObjectURL(pendingPreview);
          setPendingFile(null);
          setPendingPreview(null);
        }
        // Server emits message:new — socket listener appends for both sides
        await sendMessage(activeId, { body: body.trim(), attachments });
        setBody("");
      } finally {
        setSending(false);
      }
    },
    [activeId, body, pendingFile, pendingPreview]
  );

  function handleFileChosen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(file);
    setPendingPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    e.target.value = "";
  }


  const active = threads.find((t) => t._id === activeId);

  // ── Search ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");

  const filteredThreads = search.trim()
    ? threads.filter((t) => {
      const q = search.toLowerCase();
      const other = getOtherParticipant(t);
      const name = displayName(other).toLowerCase();
      const email = (other?.email || "").toLowerCase();
      const title = (t.listing?.title || "").toLowerCase();
      return name.includes(q) || email.includes(q) || title.includes(q);
    })
    : threads;

  /** Returns the other participant object (the seller) for a given thread */
  function getOtherParticipant(thread) {
    if (!Array.isArray(thread.participants)) return null;
    return (
      thread.participants.find((p) => {
        const pid = p?._id ?? p;
        return String(pid) !== String(me);
      }) ?? null
    );
  }

  function displayName(participant) {
    return participant?.profile?.fullName || participant?.email || "Seller";
  }

  function AvatarCircle({ participant, size = "h-8 w-8", textSize = "text-sm" }) {
    const name = displayName(participant);
    const avatarUrl = participant?.profile?.avatarUrl;
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={name}
          className={`${size} rounded-full object-cover ring-2 ring-white`}
        />
      );
    }
    return (
      <span
        className={`${size} ${textSize} inline-flex flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white`}
      >
        {initials || "S"}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main>
        <div className="w-full py-14 flex items-center justify-center" style={{ background: 'linear-gradient(to right, #4E7FF1, #B4D8FF)' }}>
          <h1 className="text-4xl font-bold text-slate-900 headings">Messages</h1>
        </div>
        <div className="mx-auto flex h-[calc(100vh-200px)] md:h-[min(70vh,640px)] max-w-6xl gap-4 px-4 py-4 md:py-8">
          <aside className={`${showMobileSidebar ? "flex" : "hidden"} md:flex w-full md:max-w-xs shrink-0 flex-col gap-0 overflow-hidden bg-[#F8F8F8] shadow-sm`}>
            {/* Header */}
            <div className="px-5 pt-5">
              <h2 className="text-lg headings text-slate-900">Conversations</h2>

              {/* Search input */}
              <div className="relative mt-3">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search here"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Recent Chats row */}
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-slate-700">
                  Recent Chats
                  <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="rounded-sm bg-[#4E7FF1] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition"
                >
                  New Chat
                </button>
              </div>
            </div>

            {/* Thread list */}
            <div className="mt-3 flex-1 overflow-y-auto px-3 pb-3">
              {loading ? (
                <p className="px-2 py-4 text-sm text-slate-500">Loading…</p>
              ) : filteredThreads.length > 0 ? (
                <ul className="space-y-1">
                  {filteredThreads.map((t) => {
                    const other = getOtherParticipant(t);
                    const name = displayName(other);
                    const isActive = t._id === activeId;
                    return (
                      <li key={t._id}>
                        <button
                          type="button"
                          onClick={() => { setActiveId(t._id); setShowMobileSidebar(false); }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${isActive
                            ? "bg-[#4E7FF1] text-white"
                            : "text-slate-800 hover:bg-slate-100"
                            }`}
                        >
                          <AvatarCircle participant={other} size="h-10 w-10" textSize="text-sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">{name}</span>
                            {t.listing?.title && (
                              <span className={`block truncate text-xs ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                                Re: {t.listing.title}
                              </span>
                            )}
                            <span className={`block text-xs ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                              {t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleString() : ""}
                            </span>
                          </span>
                          {/* Unread indicator placeholder */}
                          {isActive && (
                            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-white opacity-80" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : search.trim() ? (
                <div className="px-2 py-6 text-center">
                  <p className="text-sm font-medium text-slate-600">No results for &ldquo;{search}&rdquo;</p>
                  <p className="mt-1 text-xs text-slate-400">Try a different name or listing title.</p>
                </div>
              ) : (
                <p className="px-2 py-4 text-xs text-slate-500">No conversations yet.</p>
              )}
            </div>
          </aside>

          <section className={`${!showMobileSidebar ? "flex" : "hidden"} md:flex flex-1 flex-col overflow-hidden bg-white shadow-sm`}>
            <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-900 px-4 py-3 text-white">
              {/* Back Button for Mobile */}
              <button
                type="button"
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden p-1 mr-1 text-slate-300 hover:text-white"
                aria-label="Back to conversations"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {active && (
                <AvatarCircle
                  participant={getOtherParticipant(active)}
                  size="h-9 w-9"
                  textSize="text-sm"
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {active ? displayName(getOtherParticipant(active)) : "Chat"}
                </p>
                {active?.listing?.title && (
                  <p className="truncate text-xs text-slate-400">Re: {active.listing.title}</p>
                )}
                {!active?.listing?.title && (
                  <p className="text-xs text-slate-400">Secure messaging</p>
                )}
              </div>
            </header>
            <div className="flex-1 space-y-3 overflow-y-auto bg-[#D9D9D9] p-4">
              {messages.map((m) => {
                const senderId = m.sender?._id || m.sender;
                const mine = me && senderId && String(senderId) === String(me);
                const hasAttachments = Array.isArray(m.attachments) && m.attachments.length > 0;
                return (
                  <div
                    key={m._id}
                    className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}
                  >
                    {/* Attachments */}
                    {hasAttachments && m.attachments.map((att, i) => (
                      att.mimeType?.startsWith("image/") ? (
                        <a key={i} href={`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/${att.url}`} target="_blank" rel="noreferrer">
                          <img
                            src={`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/${att.url}`}
                            alt={att.fileName}
                            className="max-h-48 max-w-[280px] rounded-xl object-cover shadow-sm"
                          />
                        </a>
                      ) : (
                        <a
                          key={i}
                          href={`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/${att.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${mine ? "bg-blue-600 text-white" : "bg-white text-slate-800 shadow-sm"
                            }`}
                        >
                          <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="max-w-[200px] truncate">{att.fileName}</span>
                        </a>
                      )
                    ))}
                    {/* Text body */}
                    {m.body && (
                      <div
                        className={`w-fit max-w-[85%] rounded-xl px-3 py-2 text-sm ${mine ? "bg-blue-600 text-white" : "bg-white text-slate-800 shadow-sm"
                          }`}
                      >
                        {m.body}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Input area */}
            <div className="border-t border-slate-100 bg-white px-3 pb-3 pt-2">
              {/* Attachment preview strip */}
              {pendingFile && (
                <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  {pendingPreview ? (
                    <img src={pendingPreview} alt="preview" className="h-10 w-10 rounded-md object-cover" />
                  ) : (
                    <svg className="h-8 w-8 flex-shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                  <span className="flex-1 truncate text-xs text-slate-700">{pendingFile.name}</span>
                  <button
                    type="button"
                    onClick={() => { URL.revokeObjectURL(pendingPreview); setPendingFile(null); setPendingPreview(null); }}
                    className="text-slate-400 hover:text-red-500"
                    aria-label="Remove attachment"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Main input row */}
              <form onSubmit={handleSend} className="flex items-stretch gap-0">
                {/* + button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-10 flex-shrink-0 items-center justify-center border border-r-0 border-slate-300 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
                  aria-label="Attach file"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Text input */}
                <input
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
                />

                {/* Send button — sharp rectangle with white left accent */}
                <button
                  type="submit"
                  disabled={sending || !activeId || (!body.trim() && !pendingFile)}
                  className="relative flex w-14 flex-shrink-0 items-center justify-center bg-blue-500 text-white transition hover:bg-blue-600 disabled:opacity-40"
                  aria-label="Send message"
                >
                  {/* White left accent stripe */}
                  <span className="absolute left-0 top-2 h-[calc(100%-16px)] w-[3px] rounded-r-full bg-white/60" />
                  {sending ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </form>

              {/* Hidden file input */}
              <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip" className="hidden" onChange={handleFileChosen} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}
