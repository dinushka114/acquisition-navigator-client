import { useState, useEffect } from "react";
import { TestimonialCard } from "./TestimontialCard/TestimontialCard";
import { fetchApprovedReviews, submitReview } from "../../services/reviewService.js";
import { getUser } from "../../lib/authStorage.js";

const DEFAULT_TESTIMONIALS = [
  { quote: "Selling my business has never been so easy working with Acquisition Advisors. Their team helped me navigate the whole transaction from beginning to end, including negotiations, legal, and financial documents. From start to finish, I had support at every stage. This platform has what I was looking for — I cannot thank them enough for their outstanding dedication!", author: "Tom Tolliver", role: "Director of Sales & Deal Closer", rating: 4 },
  { quote: "What stood out to me most was the spirit of the listings and their transparency. The whole process felt heavily toward a digital experience for buyers, making sure both I—as a buyer—and the acquisition team were fully informed of all nuances.", author: "Lisa Vallone", role: "Director of Sales & Deal Closer", rating: 5 },
  { quote: "I find most platforms—the ones people talk about—lack something. This one markets with quality in mind. Let me find the right match rather than accepting more deals. I feel very good about my growth and support!", author: "Jane Bollene", role: "Director of Sales & Deal Closer", rating: 5 },
  { quote: "Incredible. I've tried many platforms—this one markets with quality and support throughout. An incredible experience all round and highly recommended.", author: "Jane Bollene", role: "Director of Sales & Deal Closer", rating: 5, dark: true },
];

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [showModal, setShowModal] = useState(false);
  const [reviewQuote, setReviewQuote] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: "", success: false });

  const currentUser = getUser();

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetchApprovedReviews();
        if (res.reviews && res.reviews.length > 0) {
          const formatted = res.reviews.map((r, i) => ({
            quote: r.quote,
            author: r.user?.profile?.fullName || r.user?.email || "Anonymous",
            role: r.user?.role === "seller" ? "Business Seller" : "Business Buyer",
            rating: r.rating,
            dark: i % 4 === 3 // Make every 4th card dark, similar to default
          }));
          setTestimonials(formatted);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    }
    loadReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewQuote.trim()) return;
    setSubmitStatus({ loading: true, error: "", success: false });
    try {
      await submitReview({ quote: reviewQuote.trim(), rating: reviewRating });
      setSubmitStatus({ loading: false, error: "", success: true });
      setTimeout(() => setShowModal(false), 2000); // Close modal after 2s on success
    } catch (err) {
      setSubmitStatus({ loading: false, error: err.message || "Failed to submit review", success: false });
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-100 to-blue-50 py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 relative">
          <p className="text-xs sm:text-sm headings mb-2 font-bold uppercase tracking-wide px-2">
            Don&apos;t take our word for it. See what our clients says
          </p>
          <p className="text-slate-400 text-xs mt-2 max-w-2xl mx-auto px-2 leading-relaxed">
            Hear from entrepreneurs and business owners who&apos;ve successfully navigated their acquisition journey with us.{" "}
            <span className="hidden sm:inline">
              <br />
            </span>
            Real stories, real results — built on trust, speed, and support.
          </p>

          {currentUser && (
            <button 
              onClick={() => {
                setShowModal(true);
                setSubmitStatus({ loading: false, error: "", success: false });
                setReviewQuote("");
                setReviewRating(5);
              }}
              className="mt-6 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
            >
              Write a Review
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          
          {testimonials.map((t, idx) => {
            if (idx === 0) {
              return (
                <div key={idx} className="flex flex-col gap-5">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                    <h3 className="text-xl font-extrabold text-slate-900 headings mb-3">A Seamless Exit !!</h3>
                    <span className="text-4xl headings text-blue-500 font-extrabold leading-none">"</span>
                  </div>
                  <TestimonialCard {...t} />
                </div>
              );
            }
            return <TestimonialCard key={idx} {...t} />;
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            
            <h3 className="text-xl font-bold headings text-slate-900 mb-1">Write a Review</h3>
            <p className="text-xs text-slate-500 mb-6">Share your experience with Acquisition Navigator.</p>

            {submitStatus.success ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-medium text-center">
                Thank you! Your review has been submitted and is pending moderation.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${reviewRating >= num ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-300"}`}
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Your Review</label>
                  <textarea
                    required
                    value={reviewQuote}
                    onChange={(e) => setReviewQuote(e.target.value)}
                    rows="4"
                    placeholder="Tell us what you think..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                  />
                </div>

                {submitStatus.error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{submitStatus.error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitStatus.loading}
                  className="w-full rounded-full bg-blue-600 py-3 text-sm font-bold text-white shadow hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {submitStatus.loading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}