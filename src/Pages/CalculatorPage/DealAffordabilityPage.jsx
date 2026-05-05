import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { calcDealAffordability } from "../../services/calculatorService.js";
import calcHero from "../../assets/images/calculator-hero.png";

export default function DealAffordabilityPage() {
  const [cashAvailable, setCashAvailable] = useState("100000");
  const [leveragePercent, setLeveragePercent] = useState("5");
  const [interestRatePercent, setInterestRatePercent] = useState("3");
  const [loanTermYears, setLoanTermYears] = useState("3");
  const [sdeMultiple, setSdeMultiple] = useState("3");
  const [businessSde, setBusinessSde] = useState("150000");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await calcDealAffordability({
        cashAvailable: Number(cashAvailable),
        leveragePercent: Number(leveragePercent),
        interestRatePercent: Number(interestRatePercent),
        loanTermYears: Number(loanTermYears),
        sdeMultiple: Number(sdeMultiple),
        businessSde: Number(businessSde),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="page-hero relative flex w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
        <img src={calcHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-blue-600/55" />
        <h1 className="relative z-10 headings text-4xl font-black text-slate-900 md:text-6xl">
          Deal Affordability Calculator
        </h1>
        <p className="relative z-10 mt-2 text-sm font-medium text-slate-900/80">
          Spend smart, avoid surprises. Know your financial limits now.
        </p>
      </div>
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-sm">
          <h2 className="headings font-bold text-slate-900">Investment details</h2>
          {[
            ["Cash available (Rs.)", cashAvailable, setCashAvailable],
            ["Leverage %", leveragePercent, setLeveragePercent],
            ["Interest rate %", interestRatePercent, setInterestRatePercent],
            ["Loan term (years)", loanTermYears, setLoanTermYears],
            ["SDE multiple", sdeMultiple, setSdeMultiple],
            ["Business SDE (Rs.)", businessSde, setBusinessSde],
          ].map(([label, val, setter]) => (
            <div key={label}>
              <label className="text-xs text-slate-600">{label}</label>
              <input
                className="mt-1 w-full rounded-lg border bg-white border-slate-200 px-3 py-2 text-sm"
                value={val}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white">
            Calculate
          </button>
        </form>
        <div className="rounded-xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-sm">
          <p className="text-sm font-medium headings text-center text-[#7c7c7c]">
            Seller&apos;s discretionary earnings (SDE) after principal &amp; interest (P&amp;I)
          </p>
          <p className="headings mt-2 text-3xl text-center font-bold text-slate-900">
            {result?.incomeAfterLoan != null
              ? `Rs. ${Number(result.incomeAfterLoan).toLocaleString()}`
              : "—"}
          </p>
          <hr className="my-6 border-slate-100" />
          <h3 className="text-sm font-bold text-slate-800 headings">Seller's Discretionary Earnings(SDE)  Report</h3>
          {result ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Estimated business price</dt>
                <dd>{`Rs. ${Number(result.estimatedBusinessPrice).toLocaleString()}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Loan amount needed</dt>
                <dd>{`Rs. ${Number(result.loanAmountNeeded).toLocaleString()}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Cash needed (equity)</dt>
                <dd>{`Rs. ${Number(result.cashNeeded).toLocaleString()}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Monthly loan payment</dt>
                <dd>{`Rs. ${Number(result.monthlyLoanPayment).toLocaleString()}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Annual loan payment</dt>
                <dd>{`Rs. ${Number(result.annualLoanPayment).toLocaleString()}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Income after loan</dt>
                <dd>{`Rs. ${Number(result.incomeAfterLoan).toLocaleString()}`}</dd>
              </div>
              {result.coverageRatio != null ? (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Coverage ratio (SDE ÷ annual P&amp;I)</dt>
                  <dd>{`${result.coverageRatio}x`}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-slate-500">Risk level</dt>
                <dd>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${result.riskLevel === "High"
                      ? "bg-red-100 text-red-800"
                      : result.riskLevel === "Medium"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-emerald-100 text-emerald-800"
                      }`}
                  >
                    {result.riskLevel}
                  </span>
                </dd>
              </div>
            </dl>
          ) : null}
          <p className="mt-4 text-xs text-slate-400">
            Risk bands: Low if coverage ≥ 2×, Medium if ≥ 1.3×, otherwise High.
          </p>
          <Link to="/calculators" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
            ← All calculators
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
