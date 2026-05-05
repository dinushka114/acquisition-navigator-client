import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ProtectedRoute } from "../../components/Routing/ProtectedRoute.jsx";
import {
  fetchDeal,
  updateDeal,
  addDealTask,
  updateDealTask,
  addDealNote,
} from "../../services/dealService.js";
import { formatMoney } from "../../utils/format.js";

const STEPS = [
  {
    label: "Initial Inquiry",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "NDA Signed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    label: "Business Evaluation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: "Negotiation & Agreement",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Deal Closed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
];

const STATUS_LABELS = {
  not_completed: "Not Completed",
  in_progress: "In Progress",
  completed: "Completed",
};

const STATUS_COLORS = {
  not_completed: "bg-slate-100 text-slate-600 border-slate-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function TaskRow({ task, index, onStatusChange, busy }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
        {index + 1}
      </span>

      <span className="flex-1 text-sm font-medium text-slate-800">{task.title}</span>

      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={busy}
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${STATUS_COLORS[task.status]}`}
        >
          {STATUS_LABELS[task.status]}
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => { onStatusChange(task._id, val); setOpen(false); }}
                className={`block w-full px-4 py-2.5 text-left text-xs font-medium transition hover:bg-slate-50 ${task.status === val ? "bg-blue-50 text-blue-700" : "text-slate-700"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
    </div>
  );
}

function DealRoomContent() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [error, setError] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [showAddTask, setShowAddTask] = useState(false);

  async function reload() {
    const res = await fetchDeal(dealId);
    setDeal(res.deal);
  }

  useEffect(() => {
    (async () => {
      try {
        await reload();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Not found");
      }
    })();
  }, [dealId]);

  async function setStep(n) {
    setBusy(true);
    try {
      if (n === 5 && deal?.pipelineStep === 5) {
        await updateDeal(dealId, { status: "completed" });
      } else {
        await updateDeal(dealId, { pipelineStep: n });
      }
      await reload();
    }
    finally { setBusy(false); }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setBusy(true);
    try {
      await addDealTask(dealId, { title: taskTitle.trim(), status: "in_progress" });
      setTaskTitle(""); setShowAddTask(false); await reload();
    } finally { setBusy(false); }
  }

  async function updateTaskStatus(taskId, status) {
    setBusy(true);
    try { await updateDealTask(dealId, taskId, { status }); await reload(); }
    finally { setBusy(false); }
  }

  async function addNote(e) {
    e.preventDefault();
    if (!noteBody.trim()) return;
    setBusy(true);
    try { await addDealNote(dealId, { body: noteBody.trim() }); setNoteBody(""); await reload(); }
    finally { setBusy(false); }
  }

  if (error && !deal) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <p className="py-20 text-center text-red-600">{error}</p>
        <Footer />
      </div>
    );
  }
  if (!deal) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <p className="py-20 text-center text-slate-500">Loading…</p>
        <Footer />
      </div>
    );
  }

  const l = deal.listing;
  const step = deal.pipelineStep || 1;
  const fin = l?.financials || {};
  const tasks = deal.tasks || [];
  const openCount = tasks.filter((t) => t.status === "not_completed").length;
  const pendingCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "completed").length;

  const locationLine = [l?.location?.city, l?.location?.region, l?.location?.country]
    .filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Navbar />
      <div className="w-full py-14 flex items-center justify-center" style={{ background: 'linear-gradient(to right, #4E7FF1, #B4D8FF)' }}>
        <h1 className="text-4xl font-bold text-slate-900 headings">Acquisition Deal Room</h1>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">

          <div className="flex flex-col gap-0 overflow-hidden rounded-t-3xl shadow-md">

            <div className="bg-[#B4D8FF] p-6">
              <h1 className="text-xl headings leading-snug text-slate-900">{l?.title}</h1>
              {locationLine && (
                <p className="mt-1 text-xs text-slate-600">{locationLine}</p>
              )}
              {l?.industry && (
                <span className="mt-3 inline-block rounded-sm bg-[#007BFF] px-3 py-1 text-[11px] tracking-wide text-white">
                  {l.industry}
                </span>
              )}

              <dl className="mt-4 space-y-2 text-sm">
                {(l?.askingPriceMin != null || l?.askingPriceMax != null) && (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-slate-600">Asking Price:</dt>
                    <dd className="font-bold text-slate-900">
                      {l.askingPriceMin != null && l.askingPriceMax != null && l.askingPriceMin !== l.askingPriceMax
                        ? `${formatMoney(l.askingPriceMin)}–${formatMoney(l.askingPriceMax)}`
                        : formatMoney(l.askingPriceMin ?? l.askingPriceMax)}
                    </dd>
                  </div>
                )}
                {l?.equityOfferedPercent != null && (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-slate-600">Equity Offered:</dt>
                    <dd className="font-bold text-slate-900">{l.equityOfferedPercent}%</dd>
                  </div>
                )}
                {fin.annualRevenue != null && (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-slate-600">Annual Revenue:</dt>
                    <dd className="font-bold text-slate-900">{formatMoney(fin.annualRevenue)}</dd>
                  </div>
                )}
                {fin.ebitda != null && (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-slate-600">EBITDA:</dt>
                    <dd className="font-bold text-slate-900">{formatMoney(fin.ebitda)}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/listings/${l?._id}`}
                  className="flex flex-1 items-center headings justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm text-white transition hover:bg-slate-800"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
                  </svg>
                  More Information
                </Link>
                <button
                  type="button"
                  onClick={() => navigate("/messages")}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-transparent text-slate-900 transition hover:bg-slate-900 hover:text-white"
                  aria-label="Open messages"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#2a2a2a] p-6">
              <div className="flex items-center px-2 py-2 rounded-xl bg-black justify-between">
                <span className="text-xs text-slate-300">Acquisition Progress</span>
                <span className="text-xs  text-blue-400">
                  Step {String(step).padStart(2, "0")} of 05
                </span>
              </div>

              <ol className="mt-6 space-y-0">
                {STEPS.map((s, i) => {
                  const n = i + 1;
                  const done = n < step || (n === 5 && deal.status === "completed");
                  const active = n === step && deal.status !== "completed";
                  const isLast = i === STEPS.length - 1;

                  const dateDone = deal.stepDates?.[String(n)];
                  const completedText = dateDone
                    ? `Completed ${new Date(dateDone).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}`
                    : "Completed";

                  let disabledClick = busy || n < step || n > step + 1;
                  if (n === step) disabledClick = (n !== 5) || deal.status === "completed";

                  return (
                    <li key={s.label} className="relative flex gap-4">

                      {!isLast && (
                        <span
                          className={`absolute left-[18px] top-10 h-[calc(100%-4px)] w-0.5 ${done ? "bg-emerald-500" : "bg-slate-600"
                            }`}
                        />
                      )}

                      <button
                        type="button"
                        disabled={disabledClick}
                        onClick={() => setStep(n)}
                        className={`relative z-10 mb-6 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : active
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-500 bg-transparent text-slate-400"
                          } ${!disabledClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                      >
                        {done ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : s.icon}
                      </button>

                      <div className="pb-6 pt-1">
                        <p className={`text-sm font-semibold ${active ? "text-white" : done ? "text-slate-300" : "text-slate-500"}`}>
                          {s.label}
                        </p>
                        <p className={`mt-0.5 text-[10px] ${done ? "text-slate-400" : active ? "text-blue-400" : "text-slate-600"}`}>
                          {done ? completedText : active ? "In Progress" : "Next step"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="flex flex-col gap-6">

            <div className="bg-[#F8F8F8] px-4 py-4">
              <h2 className="text-2xl text-slate-900 headings">Task Summary</h2>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: "Open Tasks", count: openCount },
                  { label: "Pending Tasks", count: pendingCount },
                  { label: "Completed Tasks", count: doneCount },
                ].map(({ label, count }) => (
                  <div key={label} className="rounded-xl bg-blue-100 px-4 py-5 text-center">
                    <p className="text-2xl font-black text-slate-900">{count}</p>
                    <p className="mt-1 text-xs font-medium text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-hidden  bg-white shadow-sm">
              <div className="flex items-center gap-1 border-b border-slate-200 px-4 pt-4">
                {[
                  { key: "tasks", label: "Tasks", icon: <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg> },
                  { key: "notes", label: "Notes", icon: <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> },
                  { key: "help", label: "Help", icon: <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" /></svg> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 rounded-t-md px-4 py-2.5 text-sm headings transition ${activeTab === tab.key
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
                {activeTab === "tasks" && (
                  <button
                    type="button"
                    onClick={() => setShowAddTask((v) => !v)}
                    className="ml-auto flex items-center gap-1.5 rounded-sm bg-[#4E7FF1] px-4 py-2 text-sm  headings text-white transition"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                    Add Task
                  </button>
                )}
              </div>

              <div className="p-4">

                {activeTab === "tasks" && (
                  <div className="space-y-3">
                    {showAddTask && (
                      <form
                        onSubmit={addTask}
                        className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3"
                      >
                        <input
                          autoFocus
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="Enter task title…"
                          className="flex-1 bg-transparent text-sm outline-none placeholder-blue-300 text-slate-800"
                        />
                        <button
                          type="submit"
                          disabled={busy || !taskTitle.trim()}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowAddTask(false); setTaskTitle(""); }}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </form>
                    )}

                    {tasks.length === 0 && !showAddTask ? (
                      <p className="py-8 text-center text-sm text-slate-400">No tasks yet. Click "Add Task" to get started.</p>
                    ) : (
                      tasks.map((t, i) => (
                        <TaskRow
                          key={t._id}
                          task={t}
                          index={i}
                          onStatusChange={updateTaskStatus}
                          busy={busy}
                        />
                      ))
                    )}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <form onSubmit={addNote} className="space-y-2">
                      <textarea
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        rows={4}
                        placeholder="Add a note for this deal…"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                      />
                      <button
                        type="submit"
                        disabled={busy || !noteBody.trim()}
                        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                      >
                        Save Note
                      </button>
                    </form>
                    <ul className="space-y-3">
                      {(deal.notes || []).map((n) => (
                        <li key={n._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-sm text-slate-800">{n.body}</p>
                          <p className="mt-2 text-xs text-slate-400">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                          </p>
                        </li>
                      ))}
                      {(deal.notes || []).length === 0 && (
                        <p className="py-4 text-center text-sm text-slate-400">No notes yet.</p>
                      )}
                    </ul>
                  </div>
                )}

                {activeTab === "help" && (
                  <div className="space-y-4 py-2">
                    {[
                      { q: "What is the Deal Room?", a: "The Deal Room is a shared workspace for the buyer and seller to track the acquisition pipeline, manage tasks, and collaborate on notes." },
                      { q: "How do I progress the pipeline?", a: "Click on any step in the Acquisition Progress panel on the left to advance or revert the deal to that stage." },
                      { q: "Who can see the Deal Room?", a: "Only the buyer, the seller, and platform admins have access to this Deal Room." },
                      { q: "How do tasks work?", a: "Either party can add tasks and update their status (Not Completed → In Progress → Completed) to keep track of due diligence items." },
                    ].map(({ q, a }) => (
                      <div key={q} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-800">{q}</p>
                        <p className="mt-1.5 text-sm text-slate-500">{a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function DealRoomPage() {
  return (
    <ProtectedRoute>
      <DealRoomContent />
    </ProtectedRoute>
  );
}
