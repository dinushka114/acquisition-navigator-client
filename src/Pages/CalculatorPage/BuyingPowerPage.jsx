import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import calcHero from "../../assets/images/calculator-hero.png";

export default function BuyingPowerPage() {
  // Investment Capacity
  const [availableCash, setAvailableCash] = useState("1000000");
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);

  // Financial Details
  const [interestRate, setInterestRate] = useState("12");
  const [loanTerm, setLoanTerm] = useState(5);

  // Business Affordability
  const [monthlyProfit, setMonthlyProfit] = useState("150000");
  const [allocationPercent, setAllocationPercent] = useState(40);

  const [result, setResult] = useState({
    buyingPower: 0,
    estimatedLoan: 0,
    monthlyPayment: 0,
    availableCashUsed: 0
  });

  useEffect(() => {
    calculateResults();
  }, [availableCash, downPaymentPercent, interestRate, loanTerm, monthlyProfit, allocationPercent]);

  const calculateResults = () => {
    const cash = parseFloat(String(availableCash).replace(/[^0-9.]/g, "")) || 0;
    const dp = downPaymentPercent / 100;
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = loanTerm * 12;
    const profit = parseFloat(String(monthlyProfit).replace(/[^0-9.]/g, "")) || 0;
    const allocation = allocationPercent / 100;

    const supportablePayment = profit * allocation;

    let maxLoanByIncome = 0;
    if (rate === 0) {
      maxLoanByIncome = supportablePayment * months;
    } else {
      maxLoanByIncome = supportablePayment * (1 - Math.pow(1 + rate, -months)) / rate;
    }

    const maxPriceByIncome = maxLoanByIncome / (1 - dp);
    const maxPriceByCash = cash / dp;

    const buyingPower = Math.min(maxPriceByIncome, maxPriceByCash);
    const estimatedLoan = buyingPower * (1 - dp);
    const actualMonthlyPayment = rate === 0 
      ? estimatedLoan / months 
      : (estimatedLoan * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);

    setResult({
      buyingPower: Math.round(buyingPower),
      estimatedLoan: Math.round(estimatedLoan),
      monthlyPayment: Math.round(actualMonthlyPayment),
      availableCashUsed: Math.round(buyingPower * dp)
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(val).replace('LKR', 'Rs.');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="page-hero relative flex w-full items-center justify-center overflow-hidden">
        <img src={calcHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-blue-600/55" />
        <h1 className="relative z-10 headings text-4xl font-black text-slate-900 md:text-6xl text-center px-4">
          Buying Power Calculator
        </h1>
      </div>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-2">
        {/* Left Column: Inputs */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-sm">
          <h2 className="headings font-bold text-slate-900">Your finances</h2>
          
          <div className="space-y-4">
            {/* Investment Capacity */}
            <div>
              <p className="text-xs font-semibold tracking-wide text-black headings mb-3">Investment Capacity</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600">Available cash (Rs.)</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    value={availableCash}
                    onChange={(e) => setAvailableCash(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600">
                    Down payment: {downPaymentPercent}%
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="mt-1 w-full accent-blue-600"
                    />
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Financial Details */}
            <div>
              <p className="text-xs font-semibold tracking-wide text-black headings mb-3">Financial Details</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600">Loan interest rate (%)</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    type="number"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600">
                    Loan term: {loanTerm} Yrs
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="mt-1 w-full accent-blue-600"
                    />
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Business Affordability */}
            <div>
              <p className="text-xs font-semibold tracking-wide text-black headings mb-3">Business Affordability</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600">Expected monthly profit (Rs.)</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    value={monthlyProfit}
                    onChange={(e) => setMonthlyProfit(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600">
                    Profit allocation for loan: {allocationPercent}%
                    <input
                      type="range"
                      min="30"
                      max="60"
                      value={allocationPercent}
                      onChange={(e) => setAllocationPercent(Number(e.target.value))}
                      className="mt-1 w-full accent-blue-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="rounded-xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-sm">
          <p className="text-lg headings font-medium text-center text-[#7c7c7c]">Estimated Maximum Buying Power</p>
          <p className="headings mt-2 text-3xl text-center font-bold text-slate-900">
            {formatCurrency(result.buyingPower)}
          </p>
          
          <hr className="my-4 border-slate-200" />

          <div className="mt-6">
            <h3 className="text-sm headings font-bold text-slate-800">Buying power report</h3>
            <dl className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt>Available cash used</dt>
                <dd className="font-semibold text-slate-900">{formatCurrency(result.availableCashUsed)}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt>Estimated loan</dt>
                <dd className="font-semibold text-slate-900">{formatCurrency(result.estimatedLoan)}</dd>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-t border-slate-200 mt-4">
                <dt className="font-bold text-slate-800">Monthly loan payment</dt>
                <dd className="font-bold text-blue-600">{formatCurrency(result.monthlyPayment)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <Link to="/calculators" className="text-sm text-blue-600 hover:underline">
              ← All calculators
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
