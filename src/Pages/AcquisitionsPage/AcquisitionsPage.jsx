import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ProtectedRoute } from "../../components/Routing/ProtectedRoute.jsx";
import { RoleRoute } from "../../components/Routing/RoleRoute.jsx";
import { fetchDeals } from "../../services/dealService.js";
import { formatMoney } from "../../utils/format.js";
import { getUser } from "../../lib/authStorage.js";

function AcquisitionsContent() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchDeals();
        setDeals(res.data || []);
      } catch {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main>
        <div className="w-full py-14 flex items-center justify-center" style={{ background: 'linear-gradient(to right, #4E7FF1, #B4D8FF)' }}>
          <h1 className="text-4xl font-bold text-slate-900 headings">
            {user?.role === "seller" ? "Deals Dashboard" : "Acquisition Dashboard"}
          </h1>
        </div>
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [String(deals.length), user?.role === "seller" ? "Total deals" : "Total acquisitions"],
              [
                String(deals.filter((d) => d.status === "active").length),
                "Active deals",
              ],
              [
                String(deals.filter((d) => d.status === "completed").length),
                "Completed",
              ],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-blue-100/70 px-6 py-8 text-center">
                <p className="headings text-3xl font-bold text-slate-900">{n}</p>
                <p className="mt-1 text-sm text-slate-600">{l}</p>
              </div>
            ))}
          </div>

          <h2 className="headings mt-10 text-lg font-bold text-slate-900">
            {user?.role === "seller" ? "Current deals" : "Current acquisitions"}
          </h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <p className="p-8 text-center text-slate-500">Loading…</p>
            ) : (
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Deal type</th>
                    <th className="px-4 py-3">Equity</th>
                    <th className="px-4 py-3">Asking</th>
                    <th className="px-4 py-3">Started</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((d, i) => {
                    const l = d.listing;
                    return (
                      <tr
                        key={d._id}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50/80"}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {l?.title ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {l?.listingType === "share" ? "Equity investment" : "Business"}
                        </td>
                        <td className="px-4 py-3">
                          {l?.listingType === "share" ? `${l?.equityOfferedPercent ?? "—"}%` : "100%"}
                        </td>
                        <td className="px-4 py-3">
                          {formatMoney(l?.askingPriceMax ?? l?.askingPriceMin)}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/deal-room/${d._id}`}
                            className="rounded bg-slate-900 px-3 py-1 text-xs text-white"
                          >
                            Deal room
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {!loading && !deals.length ? (
              <p className="p-8 text-center text-slate-500">
                {user?.role === "seller" ? "No deals yet." : "No acquisitions yet. Browse the "}
                {user?.role !== "seller" && (
                  <Link to="/market-place" className="text-blue-600 underline">
                    marketplace
                  </Link>
                )}
                {user?.role !== "seller" ? "." : ""}
              </p>
            ) : null}

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function AcquisitionsPage() {
  return (
    <ProtectedRoute>
      <RoleRoute allow={["buyer", "seller", "admin"]}>
        <AcquisitionsContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
