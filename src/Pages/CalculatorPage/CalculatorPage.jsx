import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import CalculatorHeroPhoto from "../../assets/images/calculator-hero.png";
import Cal1 from "../../assets/images/cal11.png";
import Cal2 from "../../assets/images/cal22.png";
import Cal3 from "../../assets/images/cal33.png";
import Cal4 from "../../assets/images/cal44.png";
import ThinkingImage from "../../assets/images/thinking.png"

const CalcHero = () => (
  <div className="page-hero relative w-full bg-blue-400 overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0 bg-blue-500/50" />
    <img
      src={CalculatorHeroPhoto}
      alt="About Hero"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <h1 className="relative z-10 headings text-6xl font-black text-slate-900 tracking-tight">Calculators</h1>
  </div>
);

const CalcIcon = ({ color = "#3B82F6" }) => (
  <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="40" height="48" rx="5" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" />
    <rect x="14" y="10" width="28" height="10" rx="2" fill={color} fillOpacity="0.25" />
    <circle cx="18" cy="32" r="3" fill={color} />
    <circle cx="28" cy="32" r="3" fill={color} />
    <circle cx="38" cy="32" r="3" fill={color} />
    <circle cx="18" cy="42" r="3" fill={color} />
    <circle cx="28" cy="42" r="3" fill={color} />
    <rect x="35" y="39" width="6" height="6" rx="1" fill={color} />
    <text x="14" y="20" fontSize="7" fontWeight="bold" fill={color}>NWC</text>
  </svg>
);

const ExitIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="40" height="48" rx="5" fill="#3B82F6" fillOpacity="0.12" stroke="#3B82F6" strokeWidth="2" />
    <rect x="14" y="10" width="28" height="10" rx="2" fill="#3B82F6" fillOpacity="0.25" />
    <polyline points="14,40 22,32 28,36 38,24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="12" y="20" fontSize="6" fontWeight="bold" fill="#3B82F6">EXIT</text>
  </svg>
);

const DealIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="40" height="48" rx="5" fill="#3B82F6" fillOpacity="0.12" stroke="#3B82F6" strokeWidth="2" />
    <rect x="14" y="10" width="28" height="10" rx="2" fill="#3B82F6" fillOpacity="0.25" />
    <path d="M20 34 L28 28 L36 34" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M28 28 L28 44" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    <text x="12" y="20" fontSize="5.5" fontWeight="bold" fill="#3B82F6">DEAL</text>
  </svg>
);

const BuyingIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="40" height="48" rx="5" fill="#3B82F6" fillOpacity="0.12" stroke="#3B82F6" strokeWidth="2" />
    <rect x="14" y="10" width="28" height="10" rx="2" fill="#3B82F6" fillOpacity="0.25" />
    <circle cx="28" cy="35" r="8" stroke="#3B82F6" strokeWidth="2" fill="none" />
    <text x="24" y="38" fontSize="8" fontWeight="bold" fill="#3B82F6">$</text>
    <text x="12" y="20" fontSize="5.5" fontWeight="bold" fill="#3B82F6">BUY</text>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8l3.5 3.5L13 5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const calculators = [
  {
    icon: Cal2,
    title: "Net Working Capital Calculator",
    to: "/calculators/net-working-capital",
    features: [
      "Reveal Cash Flow Requirements",
      "Compare Industry Benchmarks",
      "Optimize Business Growth",
    ],
  },
  {
    icon: Cal2,
    title: "Deal Affordability Calculator",
    to: "/calculators/deal-affordability",
    features: [
      "SBA loan qualification checker",
      "Required liquidity calculator",
      "Personal financial assessment",
    ],
  },
  {
    icon: Cal3,
    title: "Exit Value Calculator",
    to: "/calculators/exit-value",
    features: [
      "Project future cash flows",
      "Model different growth scenarios",
      "Calculate IRR based on exit assumptions",
    ],
  },
  {
    icon: Cal4,
    title: "Buying Power Calculator",
    to: "/calculators/buying-power",
    features: [
      "Maximum purchase price estimator",
      "Debt capacity analysis",
      "Monthly payment projections",
    ],
  },
];

const CalculatorCards = () => (
  <section className="max-w-5xl mx-auto px-6 py-16">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-black text-slate-900 headings mb-3">Boom or Bust Calculator</h2>
      <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
        Wondering whether your business is a hidden goldmine or just hype? Our smart valuation tools cut through the noise with data-driven accuracy—so you can dream big with confidence.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {calculators.map((calc) => (
        <div
          key={calc.title}
          className="bg-[#F8F8F8] rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-8 pb-4 flex flex-col items-center text-center">
            <img src={calc.icon} alt="" srcset="" />
            <h3 className="text-base headings font-bold text-slate-900 mb-3">{calc.title}</h3>
            <div className="w-full h-px bg-slate-100 mb-4" />
            <ul className="space-y-3 mb-6 mx-auto w-fit">
              {calc.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-slate-600 text-sm text-left leading-relaxed">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-8 pb-6">
            {calc.to ? (
              <Link
                to={calc.to}
                className="flex w-full headings items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-700"
              >
                Use Calculator →
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-slate-400 py-3 text-sm font-semibold text-white"
              >
                Coming soon
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const CTABanner = () => (
  <section className="max-w-5xl mx-auto px-6 pb-16">
    <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[220px] shadow-xl">
      <div className="w-full md:w-2/5 relative min-h-[160px]">
        <img
          src={ThinkingImage}
          alt="CTA"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" />
      </div>
      <div className="flex-1 bg-slate-900 flex flex-col justify-center px-10 py-8">
        <h3 className="text-white headings text-xl font-black mb-3">Thinking of making a move?</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Our calculators transform complex numbers into confident decisions. From buying power to exit value, they give you the insights to act boldly and win.
        </p>
        <div>
          <button className="bg-blue-600 headings hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md shadow-blue-900/40 transition-all duration-200">
            Book your strategy call
          </button>
        </div>
      </div>
    </div>
  </section>
);

const AllCalculators = () => {
  const active = [
    { label: "Net Working Capital", to: "/calculators/net-working-capital" },
    { label: "Deal Affordability", to: "/calculators/deal-affordability" },
    { label: "Exit value", to: "/calculators/exit-value" },
    { label: "Buying Power", to: "/calculators/buying-power" },
  ];
  const comingSoon = ["Cash on cash ROI", "Debt Service"];

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <div className="bg-slate-900 rounded-2xl px-10 py-10">
        <h3 className="text-white headings text-lg font-bold text-center mb-7">All Calculators</h3>
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {active.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white headings transition-all duration-200 hover:bg-blue-700"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="rounded-lg bg-blue-600/50 px-6 py-2.5 text-sm font-semibold text-white/80 headings"
              >
                {item.label}
              </span>
            )
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {comingSoon.map((name) => (
            <div key={name} className="relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-blue-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  Coming Soon
                </span>
              </div>
              <button
                disabled
                className="bg-blue-600/60 headings text-white/70 text-sm font-semibold px-6 py-2.5 rounded-lg cursor-not-allowed mt-1"
              >
                {name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CalculatorsPage = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Navbar />
    <main className="flex-1 bg-slate-50">
      <CalcHero />
      <CalculatorCards />
      <CTABanner />
      <AllCalculators />
    </main>
    <Footer />
  </div>
);