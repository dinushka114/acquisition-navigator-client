import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ProtectedRoute } from "../../components/Routing/ProtectedRoute.jsx";
import { RoleRoute } from "../../components/Routing/RoleRoute.jsx";
import { fetchListings, deleteListing } from "../../services/listingService.js";
import { formatMoney } from "../../utils/format.js";
import { Pencil, Trash2, Eye } from "lucide-react";

function SellerDashboardContent() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchListings({ mine: "true", limit: "50" });
        setRows(res.data || []);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const views = rows.reduce((a, l) => a + (l.viewsCount || 0), 0);
  const shortlists = rows.reduce((a, l) => a + (l.shortlistCount || 0), 0);

  async function handleDelete(id) {
    if (!confirm("Delete this listing?")) return;
    try {
      await deleteListing(id);
      setRows((r) => r.filter((x) => x._id !== id));
    } catch {
      alert("Could not delete");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main>
        <div className="w-full py-14 flex items-center justify-center" style={{ background: 'linear-gradient(to right, #4E7FF1, #B4D8FF)' }}>
          <h1 className="text-4xl font-bold text-slate-900 headings">Seller Dashboard</h1>
        </div>
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="headings text-lg font-bold text-slate-900">Listing Overview</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              [views.toLocaleString(), "Listing views"],
              [shortlists.toLocaleString(), "Buyer shortlists"],
              [String(rows.length), "Total listings"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-[#B4D8FF] px-6 py-8 text-center">
                <p className="headings text-3xl font-bold text-slate-900">{n}</p>
                <p className="mt-1 text-sm text-slate-600">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <h2 className="headings text-lg font-bold text-slate-900">Current leads</h2>
            {/* <Link
              to="/list-my-business"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + New listing
            </Link> */}
          </div>

          <div className="mt-4 overflow-x-auto bg-[#F8F8F8] shadow-sm">
            {loading ? (
              <p className="p-8 text-center text-slate-500">Loading…</p>
            ) : (
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-[#F8F8F8] text-xs headings text-black ">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Deal type</th>
                    <th className="px-4 py-3">Equity</th>
                    <th className="px-4 py-3">Valuation / price</th>
                    <th className="px-4 py-3">Date Listed</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#F8F8F8' }}>
                  {rows.map((l, i) => (
                    <tr
                      key={l._id}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50/80"}
                    >
                      <td className="px-4 py-3  text-slate-900">{l.title}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {l.listingType === "share" ? "Equity investment" : "Business"}
                      </td>
                      <td className="px-4 py-3">
                        {l.listingType === "share" ? `${l.equityOfferedPercent ?? "—"}%` : "100%"}
                      </td>
                      <td className="px-4 py-3">
                        {l.valuation?.baseEstimate != null
                          ? formatMoney(l.valuation.baseEstimate)
                          : formatMoney(l.askingPriceMax ?? l.askingPriceMin)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block w-20 rounded-sm px-2 py-1 text-xs text-center ${l.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                            }`}
                        >
                          {l.status === "published" ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <Link
                            to={`/list-my-business?edit=${l._id}`}
                            className="rounded-lg bg-[#228B22] px-2 py-1 text-xs w-15 text-center font-semibold text-white flex items-center gap-1 justify-center"
                          >
                            <Pencil size={12} />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(l._id)}
                            className="rounded-lg bg-[#FF0000] px-2 py-1 text-xs w-15 text-center font-semibold text-white flex items-center gap-1 justify-center"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                          <Link
                            to={`/listings/${l._id}`}
                            className="rounded-lg bg-[#000000] px-2 py-1 text-xs w-15 text-center font-semibold text-white flex items-center gap-1 justify-center"
                          >
                            <Eye size={12} />
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && !rows.length ? (
              <p className="p-8 text-center text-slate-500">No listings yet.</p>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function SellerDashboardPage() {
  return (
    <ProtectedRoute>
      <RoleRoute allow={["seller", "admin"]}>
        <SellerDashboardContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
