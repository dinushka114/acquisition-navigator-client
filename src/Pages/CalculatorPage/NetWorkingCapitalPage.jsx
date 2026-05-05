import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { calcNetWorkingCapital } from "../../services/calculatorService.js";
import calcHero from "../../assets/images/calculator-hero.png";

const INDUSTRIES = [
  { value: "", label: "Select industry (optional)" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Professional services" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "food", label: "Food & hospitality" },
  { value: "construction", label: "Construction" },
  { value: "other", label: "Other" },
];

function InfoMark({ text }) {
  return (
    <span
      className="ml-1 inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-300 text-[9px] font-bold text-slate-500"
      title={text}
      role="img"
      aria-label={text}
    >
      i
    </span>
  );
}

function FieldRow({ label, hint, value, onChange }) {
  return (
    <div>
      <label className="flex items-center text-xs text-slate-600">
        {label}
        {hint ? <InfoMark text={hint} /> : null}
      </label>
      <input
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function NetWorkingCapitalPage() {
  const [industry, setIndustry] = useState("");
  const [values, setValues] = useState({
    cash: "100000",
    accountsReceivable: "50000",
    stockInventory: "75000",
    shortTermInvestment: "25000",
    accountsPayable: "40000",
    unearnedRevenue: "15000",
    taxPayable: "35000",
    accruedExpenses: "15000",
    tradeDebt: "15000",
    grossSales: "500000",
    salesReturns: "25000",
    expectedGrowthRatePercent: "5",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const set = (k) => (v) => setValues((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const nums = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, Number(v) || 0])
      );
      const data = await calcNetWorkingCapital({
        industry: industry || undefined,
        ...nums,
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
        <h1 className="relative z-10 headings px-4 text-center text-4xl font-black text-slate-900 md:text-6xl">
          Net Working Capital Calculator
        </h1>
      </div>
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-sm">
          {/* <h2 className="headings font-bold text-slate-900">Inputs</h2> */}

          <div>
            {/* <label className="text-xs text-slate-600">Select industry</label> */}
            <p className="text-xs font-semibold tracking-wide text-black headings">Select Industry</p>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              {INDUSTRIES.map((o) => (
                <option key={o.value || "none"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs font-semibold tracking-wide text-black headings">Current assets</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow
              label="Cash & cash equivalents"
              hint="Cash on hand and instruments that can be converted to cash quickly."
              value={values.cash}
              onChange={set("cash")}
            />
            <FieldRow
              label="Accounts receivable"
              hint="Money owed to the business by customers for goods or services sold on credit."
              value={values.accountsReceivable}
              onChange={set("accountsReceivable")}
            />
            <FieldRow
              label="Stock inventory"
              hint="Value of goods held for sale or materials held for production."
              value={values.stockInventory}
              onChange={set("stockInventory")}
            />
            <FieldRow
              label="Short-term investments"
              hint="Marketable securities or other investments expected to be liquid within a year."
              value={values.shortTermInvestment}
              onChange={set("shortTermInvestment")}
            />
          </div>

          <p className="text-xs font-semibold tracking-wide text-black headings">Current liabilities</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow
              label="Accounts payable"
              hint="Amounts owed to suppliers for purchases made on credit."
              value={values.accountsPayable}
              onChange={set("accountsPayable")}
            />
            <FieldRow
              label="Unearned revenue"
              hint="Payments received before delivering goods or services."
              value={values.unearnedRevenue}
              onChange={set("unearnedRevenue")}
            />
            <FieldRow
              label="Tax payable"
              hint="Tax obligations due within the next operating cycle."
              value={values.taxPayable}
              onChange={set("taxPayable")}
            />
            <FieldRow
              label="Accrued expenses"
              hint="Expenses incurred but not yet paid (wages, utilities, etc.)."
              value={values.accruedExpenses}
              onChange={set("accruedExpenses")}
            />
            <FieldRow
              label="Trade debt"
              hint="Short-term borrowing or trade credit due within a year."
              value={values.tradeDebt}
              onChange={set("tradeDebt")}
            />
          </div>

          <hr className="border-slate-100" />
          {/* <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Additional financial data</p> */}
          <p className="text-xs font-semibold tracking-wide text-black headings">Additional financial data</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow
              label="Gross sales"
              hint="Total sales before returns, discounts, or allowances."
              value={values.grossSales}
              onChange={set("grossSales")}
            />
            <FieldRow
              label="Sales returns & allowances"
              hint="Deductions from gross sales for returns and adjustments."
              value={values.salesReturns}
              onChange={set("salesReturns")}
            />
            <FieldRow
              label="Expected growth rate %"
              hint="Applied to base net sales for forward-looking turnover (optional planning view)."
              value={values.expectedGrowthRatePercent}
              onChange={set("expectedGrowthRatePercent")}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white">
            Calculate
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-sm">
          <p className="text-lg headings text-center font-medium text-[#7c7c7c]">Recommended net working capital</p>
          <p className="headings mt-2 text-3xl text-center font-bold text-slate-900">
            {result?.recommendedNetWorkingCapital != null
              ? `Rs. ${Number(result.recommendedNetWorkingCapital).toLocaleString()}`
              : "—"}
          </p>

          <hr className="my-4" style={{ color: '#d1d5db' }} />

          {result ? (
            <div className="mt-8">
              <h3 className="text-sm font-bold headings text-slate-800">Working capital turnover ratio (WCTR) report</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between  pb-2">
                  <dt className="text-slate-600">Net sales</dt>
                  <dd className="font-semibold text-slate-900">
                    Rs. {Number(result.netSales).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt className="text-slate-600">Net working capital</dt>
                  <dd className="font-semibold text-slate-900">
                    Rs. {Number(result.netWorkingCapital).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-600">Working capital turnover</dt>
                  <dd>
                    {result.workingCapitalTurnoverRatio != null ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {result.workingCapitalTurnoverRatio}x
                      </span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </dd>
                </div>
              </dl>
              {result.industryBenchmarkWctr != null ? (
                <p className="mt-4 text-xs text-slate-500">
                  Industry benchmark WCTR (reference): ~{result.industryBenchmarkWctr}x
                  {result.industrySuggestedNwc != null
                    ? ` · Implied NWC from benchmark: Rs. ${Number(result.industrySuggestedNwc).toLocaleString()}`
                    : ""}
                </p>
              ) : null}
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
