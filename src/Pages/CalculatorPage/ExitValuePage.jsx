import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { calcExitValue } from "../../services/calculatorService.js";
import calcHero from "../../assets/images/calculator-hero.png";

export default function ExitValuePage() {
  const [totalRevenue, setTotalRevenue] = useState("5000000");
  const [industryRiskMultiple, setIndustryRiskMultiple] = useState("3");
  const [growthRatePercent, setGrowthRatePercent] = useState("10");
  const [customerStabilityMultiple, setCustomerStabilityMultiple] = useState("1");
  const [ownerDependenceMultiple, setOwnerDependenceMultiple] = useState("1");
  const [ageMultiple, setAgeMultiple] = useState("1");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await calcExitValue({
        totalRevenue: Number(totalRevenue),
        industryRiskMultiple: Number(industryRiskMultiple),
        growthRatePercent: Number(growthRatePercent),
        customerStabilityMultiple: Number(customerStabilityMultiple),
        ownerDependenceMultiple: Number(ownerDependenceMultiple),
        ageMultiple: Number(ageMultiple),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="page-hero relative flex w-full items-center justify-center overflow-hidden">
        <img src={calcHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-blue-600/55" />
        <h1 className="relative z-10 headings text-4xl font-black text-slate-900 md:text-6xl text-center px-4">
          Exit Value Calculator
        </h1>
      </div>
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-sm">
          <h2 className="headings font-bold text-slate-900">Investment details</h2>
          <div>
            <label className="text-xs text-slate-600">Total revenue (Rs.)</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={totalRevenue}
              onChange={(e) => setTotalRevenue(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Industry risk (multiples)</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={industryRiskMultiple}
              onChange={(e) => setIndustryRiskMultiple(e.target.value)}
            >
              <option value="4">Low risk (food, retail, essential services) — 4×</option>
              <option value="3">Medium risk — 3×</option>
              <option value="2">High risk (trend businesses, etc.) — 2×</option>
            </select>
          </div>
          <label className="block text-xs text-slate-600">
            Revenue growth rate: {growthRatePercent}%
            <input
              type="range"
              min="0"
              max="100"
              value={growthRatePercent}
              onChange={(e) => setGrowthRatePercent(e.target.value)}
              className="mt-1 w-full"
            />
          </label>
          <div>
            <label className="text-xs text-slate-600">Customer stability (multiples)</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={customerStabilityMultiple}
              onChange={(e) => setCustomerStabilityMultiple(e.target.value)}
            >
              <option value="0.8">Low — 0.8×</option>
              <option value="1">Medium — 1.0×</option>
              <option value="1.1">High — 1.1×</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-600">Owner dependence</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={ownerDependenceMultiple}
              onChange={(e) => setOwnerDependenceMultiple(e.target.value)}
            >
              <option value="0.8">Highly dependent — 0.8×</option>
              <option value="1">1.0×</option>
              <option value="1.1">Independent — 1.1×</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-600">Business age (multiples)</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={ageMultiple}
              onChange={(e) => setAgeMultiple(e.target.value)}
            >
              <option value="0.8">0–2 yrs — 0.8×</option>
              <option value="1">2–5 yrs — 1.0×</option>
              <option value="1.2">5+ yrs — 1.2×</option>
            </select>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white">
            Calculate
          </button>
        </form>
        <div className="rounded-xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-sm">
          <p className="text-lg headings font-medium text-center text-[#7c7c7c]">Estimated adjusted exit valuation (EAEV)</p>
          <p className="headings mt-2 text-3xl text-center font-bold text-slate-900">
            {result?.estimatedAdjustedExitValuation != null
              ? `Rs. ${Number(result.estimatedAdjustedExitValuation).toLocaleString()}`
              : "—"}
          </p>
          <hr className="my-4 border-slate-200" />
          {result?.inputs ? (
            <div className="mt-6">
              <h3 className="text-sm headings font-bold text-slate-800">Exit value report</h3>
              <dl className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt>Total revenue</dt>
                  <dd className="font-medium text-slate-900">
                    Rs. {Number(result.inputs.totalRevenue).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt>Industry risk</dt>
                  <dd className="font-semibold text-slate-900">{result.inputs.industryRiskMultiple}×</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt>Growth rate</dt>
                  <dd className="font-semibold text-slate-900">{result.inputs.growthRatePercent}%</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt>Customer stability</dt>
                  <dd className="font-semibold text-slate-900">{result.inputs.customerStabilityMultiple}×</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt>Owner dependence</dt>
                  <dd className="font-semibold text-slate-900">{result.inputs.ownerDependenceMultiple}×</dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt>Business age</dt>
                  <dd className="font-semibold text-slate-900">
                    {(() => {
                      const m = result.inputs.ageMultiple;
                      if (m <= 0.85) return "0–2 yrs — 0.8×";
                      if (m >= 1.15) return "5+ yrs — 1.2×";
                      return "2–5 yrs — 1.0×";
                    })()}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
          <Link to="/calculators" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
            ← All calculators
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
