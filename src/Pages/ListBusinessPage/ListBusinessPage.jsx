import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ProtectedRoute } from "../../components/Routing/ProtectedRoute.jsx";
import { RoleRoute } from "../../components/Routing/RoleRoute.jsx";
import { updateMe, fetchMe } from "../../services/userService.js";
import {
  createListing,
  updateListing,
  fetchListing,
  uploadListingCover,
  uploadListingDocument,
} from "../../services/listingService.js";

const STEPS = [
  { n: 1, label: "User Information" },
  { n: 2, label: "Business Details" },
  { n: 3, label: "Profile Information" },
  { n: 4, label: "Verification Docs" },
];

function StepIndicator({ step }) {
  return (
    <div className="mb-10 flex items-start justify-between">
      {STEPS.map((s, i) => {
        const isCompleted = step > s.n;
        const isActive = step === s.n;
        const isPending = step < s.n;
        return (
          <div key={s.n} className="flex flex-1 flex-col items-center relative">
            {i > 0 && (
              <div
                className={`absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2 ${isCompleted || isActive ? "bg-blue-800" : "bg-blue-200"
                  }`}
                style={{ left: "-50%", right: "50%", width: "100%" }}
              />
            )}
            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold border-2 ${isActive
                ? "border-blue-400 bg-blue-100 text-blue-800"
                : isCompleted
                  ? "border-blue-900 bg-blue-900 text-white"
                  : "border-blue-900 bg-blue-900 text-white"
                }`}
            >
              {isCompleted ? "✓" : `0${s.n}`}
            </div>
            <p className={`mt-2 text-xs font-medium text-center ${isActive ? "text-blue-600" : "text-slate-500"}`}>
              Step {String(s.n).padStart(2, "0")}
            </p>
            <p
              className={`text-xs font-bold text-center ${isActive ? "text-blue-800" : "text-blue-900"
                }`}
            >
              {s.label}
            </p>
            <p className={`text-[11px] text-center ${isActive ? "text-blue-500 font-medium" : "text-slate-400"}`}>
              {isCompleted ? "Completed" : isActive ? "In Progress" : "Pending"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs headings text-slate-800">{label}:</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 placeholder:text-slate-400";

function ListBusinessContent() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [step, setStep] = useState(1);
  const [listingId, setListingId] = useState(() => editId || sessionStorage.getItem("an_listing_draft") || "");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [listingType, setListingType] = useState("full");
  const [equityPct, setEquityPct] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [cashFlow, setCashFlow] = useState("");
  const [grossRevenue, setGrossRevenue] = useState("");
  const [inventory, setInventory] = useState("");
  const [ebitda, setEbitda] = useState("");
  const [description, setDescription] = useState("");
  const [detailedInformation, setDetailedInformation] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const [tourUrl, setTourUrl] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMe();
        const u = res.user;
        if (u?.profile?.fullName) setFullName(u.profile.fullName);
        if (u?.profile?.phone) setPhone(u.profile.phone);
        if (u?.email) setEmail(u.email);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    if (!listingId) return;
    (async () => {
      try {
        const res = await fetchListing(listingId);
        const l = res.listing;
        if (!l) return;
        
        if (l.title) setBusinessName(l.title);
        if (l.industry) setIndustry(l.industry);
        if (l.location?.addressLine) setAddress(l.location.addressLine);
        if (l.listingType) setListingType(l.listingType);
        if (l.equityOfferedPercent != null) setEquityPct(String(l.equityOfferedPercent));
        if (l.askingPriceMax != null) setAskingPrice(String(l.askingPriceMax));
        if (l.financials?.sde != null) setCashFlow(String(l.financials.sde));
        if (l.financials?.annualRevenue != null) setGrossRevenue(String(l.financials.annualRevenue));
        if (l.financials?.ebitda != null) setEbitda(String(l.financials.ebitda));
        if (l.financials?.inventory != null) setInventory(String(l.financials.inventory));
        if (l.description) setDescription(l.description);
        if (l.detailedInformation) setDetailedInformation(l.detailedInformation);
        if (l.tourUrl) setTourUrl(l.tourUrl);
      } catch (err) {
        console.error("Failed to load existing listing data", err);
      }
    })();
  }, [listingId]);

  async function saveStep1(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await updateMe({ fullName, phone });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveStep2(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const num = (v) => (v === "" ? undefined : Number(v));
      const payload = {
        title: businessName,
        industry,
        listingType,
        status: "draft",
        description,
        detailedInformation: detailedInformation.trim() || undefined,
        location: { addressLine: address, country: "Sri Lanka" },
        askingPriceMin: num(askingPrice),
        askingPriceMax: num(askingPrice),
        equityOfferedPercent: listingType === "share" ? num(equityPct) : undefined,
        financials: {
          annualRevenue: num(grossRevenue),
          ebitda: num(ebitda),
          sde: num(cashFlow) || num(ebitda),
          inventory: num(inventory),
        },
      };
      if (listingType === "share" && (payload.equityOfferedPercent == null || payload.equityOfferedPercent === 0)) {
        setError("Equity % is required for equity listings.");
        setBusy(false);
        return;
      }
      let id = listingId;
      if (id) {
        await updateListing(id, payload);
      } else {
        const res = await createListing(payload);
        id = res.listing._id;
        setListingId(id);
        sessionStorage.setItem("an_listing_draft", id);
      }
      if (coverImage && id) await uploadListingCover(id, coverImage);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveStep3(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (!listingId) throw new Error("Missing listing draft");
      await updateListing(listingId, { tourUrl: tourUrl.trim() || undefined, description });
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveStep4(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (!listingId) throw new Error("Missing listing");
      if (file) await uploadListingDocument(listingId, file);
      await updateListing(listingId, { status: "published" });
      sessionStorage.removeItem("an_listing_draft");
      window.location.href = "/seller-dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const btnBack = "rounded border headings border-slate-400 bg-white px-8 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50";
  const btnNext = "rounded headings bg-[#4E7FF1] px-10 py-3 text-xs font-semibold text-white hover:bg-[#4E7FF1] disabled:opacity-50";

  return (
    <div className="min-h-screen bg-black font-sans">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12" >
        <div className="rounded-2xl bg-white p-10 shadow-sm">
          <StepIndicator step={step} />

          {error && (
            <p className="mb-4 rounded bg-red-50 px-3 py-2 text-center text-sm text-red-600">{error}</p>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <form onSubmit={saveStep1} className="space-y-6">
              <h2 className="text-center text-3xl headings text-slate-900">Tell Us About Yourself</h2>

              <Field label="Full Name">
                <input
                  className={inputCls}
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email">
                  <input
                    className={`${inputCls} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    placeholder="Email"
                    value={email}
                    readOnly
                  />
                </Field>
                <Field label="Phone No">
                  <input
                    className={inputCls}
                    placeholder="Phone No"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>
              </div>

              <div className="flex justify-between pt-4">
                <Link to="/" className={btnBack}>Go Back</Link>
                <button type="submit" disabled={busy} className={btnNext}>Submit</button>
              </div>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={saveStep2} className="space-y-5">
              <h2 className="text-center text-3xl headings text-slate-900">Tell Us About Your Business</h2>

              <Field label="Business Name">
                <input className={inputCls} placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
              </Field>

              <Field label="Industry / Category">
                <input className={inputCls} placeholder="Industry / category" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
              </Field>

              <Field label="Business Address">
                <input className={inputCls} placeholder="Business address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business Phone">
                  <input className={inputCls} placeholder="Business phone" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} />
                </Field>
                <Field label="Business Email">
                  <input className={inputCls} placeholder="Business email" type="email" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} />
                </Field>
              </div>

              <Field label="Listing Type">
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="lt" checked={listingType === "full"} onChange={() => setListingType("full")} />
                    Business sale
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="lt" checked={listingType === "share"} onChange={() => setListingType("share")} />
                    Equity investment
                  </label>
                </div>
              </Field>

              {listingType === "share" && (
                <Field label="Equity Offered (%)">
                  <input className={inputCls} placeholder="e.g. 25" value={equityPct} onChange={(e) => setEquityPct(e.target.value)} />
                </Field>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Asking Price (Rs.)">
                  <input className={inputCls} placeholder="0" value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} />
                </Field>
                <Field label="Cash Flow / SDE (Rs.)">
                  <input className={inputCls} placeholder="0" value={cashFlow} onChange={(e) => setCashFlow(e.target.value)} />
                </Field>
                <Field label="Gross Revenue (Rs.)">
                  <input className={inputCls} placeholder="0" value={grossRevenue} onChange={(e) => setGrossRevenue(e.target.value)} />
                </Field>
                <Field label="EBITDA (Rs.)">
                  <input className={inputCls} placeholder="0" value={ebitda} onChange={(e) => setEbitda(e.target.value)} />
                </Field>
              </div>

              <Field label="Inventory Value (Rs.)">
                <input className={inputCls} placeholder="0" value={inventory} onChange={(e) => setInventory(e.target.value)} />
              </Field>

              <Field label="About">
                <textarea className={inputCls} rows={3} placeholder="Describe your business" value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>

              <Field label="Detailed Information">
                <textarea className={inputCls} rows={4} placeholder="Financials, operations, transition, etc." value={detailedInformation} onChange={(e) => setDetailedInformation(e.target.value)} />
              </Field>

              <Field label="Cover Photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-600 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
                />
              </Field>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(1)} className={btnBack}>Go Back</button>
                <button type="submit" disabled={busy} className={btnNext}>Continue</button>
              </div>
            </form>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <form onSubmit={saveStep3} className="space-y-6">
              <h2 className="text-center text-3xl font-extrabold text-slate-900">Profile Information</h2>
              <p className="text-center text-xs text-slate-500">
                Optional virtual tour link. Social profile URLs can be added when the API supports them.
              </p>

              <Field label="Tour URL (optional)">
                <input className={inputCls} placeholder="https://..." value={tourUrl} onChange={(e) => setTourUrl(e.target.value)} />
              </Field>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(2)} className={btnBack}>Go Back</button>
                <button type="submit" disabled={busy} className={btnNext}>Continue</button>
              </div>
            </form>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <form onSubmit={saveStep4} className="space-y-6">
              <h2 className="text-center text-3xl font-extrabold text-slate-900">Verification Documents</h2>
              <p className="text-center text-xs text-slate-500">
                Upload any supporting documents (business registration, financials, etc.)
              </p>

              <Field label="Upload Document">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-600 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
                />
              </Field>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(3)} className={btnBack}>Go Back</button>
                <button type="submit" disabled={busy} className={btnNext}>Publish Listing</button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ListBusinessPage() {
  return (
    <ProtectedRoute>
      <RoleRoute allow={["seller", "admin"]}>
        <ListBusinessContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}