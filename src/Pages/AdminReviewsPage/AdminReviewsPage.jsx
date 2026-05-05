import { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ProtectedRoute } from "../../components/Routing/ProtectedRoute";
import { RoleRoute } from "../../components/Routing/RoleRoute";
import { fetchAllReviews, updateReviewStatus } from "../../services/reviewService";

function AdminReviewsContent() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await fetchAllReviews();
      setReviews(res.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReviewStatus(id, status);
      setReviews(reviews.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="headings text-3xl font-bold text-slate-900 mb-8">Manage Reviews</h1>

        <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-slate-500">Loading...</p>
          ) : reviews.length === 0 ? (
            <p className="p-8 text-center text-slate-500">No reviews found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F8F8] text-xs font-semibold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Quote</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{r.user?.profile?.fullName || "Anonymous"}</div>
                      <div className="text-xs text-slate-500">{r.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-amber-400">
                        {r.rating} <span className="ml-1 text-lg">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="line-clamp-2 text-slate-600">{r.quote}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(r._id, 'approved')}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-900 mr-3"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(r._id, 'rejected')}
                          className="text-xs font-semibold text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <ProtectedRoute>
      <RoleRoute allow={["admin"]}>
        <AdminReviewsContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
