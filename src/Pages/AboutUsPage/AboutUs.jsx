import { useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import AboutPhoto from "../../assets/images/about1.png";
import AboutHeroPhoto from "../../assets/images/about-hero.png";

const AboutHero = () => (
  <div className="page-hero relative w-full overflow-hidden flex items-center justify-center">
    <img 
      src={AboutHeroPhoto} 
      alt="About Hero" 
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-slate-900/20" />

    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />

    <h1 className="relative headings z-10 text-6xl font-black tracking-tight">
      About Us
    </h1>
  </div>
);

const ModeToggle = ({ mode, setMode }) => (
  <div className="flex items-center justify-center gap-4 py-8 border-b border-slate-100">
    <span className={`text-sm font-semibold ${mode === "sell" ? "text-slate-900" : "text-slate-400"}`}>
      I'm here to <span className="font-black">sell</span>
    </span>
    <button
      onClick={() => setMode(mode === "sell" ? "buy" : "sell")}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${mode === "buy" ? "bg-[#4E7FF1]" : "bg-blue-400"
        }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${mode === "buy" ? "left-7" : "left-1"
          }`}
      />
    </button>
    <span className={`text-sm font-semibold ${mode === "buy" ? "text-slate-900" : "text-slate-400"}`}>
      I'm looking to <span className="font-black">buy</span>
    </span>
  </div>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const sellFeatures = [
  "10,000+ Active Buyers & Investors",
  "Accelerated Deal Closings",
  "Streamlined Due Diligence Process",
  "All-in-One Business Acquisition Platform",
];

const buyFeatures = [
  "Thousands of Verified Business Listings",
  "Smart AI Buyer–Seller Matching",
  "Complete Due Diligence Support",
  "Secure & Transparent Transactions",
];

const SellHeroSection = ({ mode }) => {
  const isSell = mode === "sell";
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 max-w-lg">
          <p className="text-sm text-slate-500 mb-2">
            {isSell ? "Why sell in Acquisition Navigator?" : "Why buy in Acquisition Navigator?"}
          </p>
          <h2 className="text-4xl font-black headings text-slate-900 leading-tight mb-6">
            {isSell
              ? "Millions of Buyers. More Successful Exits."
              : "Thousands of Deals. Smarter Acquisitions."}
          </h2>
          <ul className="space-y-2.5 mb-8">
            {(isSell ? sellFeatures : buyFeatures).map((f) => (
              <li key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-[#4E7FF1] flex items-center justify-center flex-shrink-0">
                  <CheckIcon />
                </div>
                <span className="text-sm text-slate-700 font-medium">{f}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <button className="bg-[#4E7FF1] hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md shadow-blue-200 flex items-center gap-2 transition-all duration-200">
              {isSell ? "Sell Now" : "Browse Listings"} ⊞
            </button>
            <button className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-200">
              {isSell ? "Run Free Valuation" : "Learn More"}
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">

          <div className="w-80 rounded-2xl bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-200 overflow-hidden relative">
            <img
              src={AboutPhoto}
              alt="Handshake"
              className=" opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const toolsSell = [
  {
    title: "Advanced Valuation Tools",
    desc: "Our smart valuation calculators help you estimate market value based on earnings, growth, and industry trends — so you enter negotiations prepared.",
    color: "text-blue-600",
  },
  {
    title: "Complete Deal Management",
    desc: "From receiving offers and negotiating terms to signing agreements and tracking payments — everything is streamlined and organized.",
    color: "text-blue-600",
  },
  {
    title: "Full Transparency & Control",
    desc: "Track buyer activity, monitor deal progress, and communicate directly — with complete visibility and control over your sale.",
    color: "text-blue-600",
  },
];

const toolsBuy = [
  {
    title: "AI-Powered Search",
    desc: "Our intelligent matching engine surfaces the most relevant listings for your goals, budget, and industry preference — cutting through the noise.",
    color: "text-blue-600",
  },
  {
    title: "Verified Financials",
    desc: "Access detailed financial records, audited reports, and valuation summaries before making any commitment — fully transparent.",
    color: "text-blue-600",
  },
  {
    title: "Guided Acquisition Process",
    desc: "Step-by-step deal support from offer to close — legal templates, escrow guidance, and dedicated advisors at every stage.",
    color: "text-blue-600",
  },
];

const ToolsSection = ({ mode }) => {
  const isSell = mode === "sell";
  const tools = isSell ? toolsSell : toolsBuy;
  return (
    <section className="bg-blue-100 max-w-7xl mx-auto px-6 py-14">
      <div className="max-w-7xl mx-auto">
        <p className="text-center headings text-xl font-semibold text-slate-700 mb-8">
          {isSell
            ? "All the Tools and Expertise You Need to Sell Now"
            : "All the Tools and Expertise You Need to Buy Now"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {tools.map((t) => (
            <div key={t.title} className="text-center px-4">
              <h3 className={`text-sm headings font-bold mb-3 ${t.color}`}>{t.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-400 mb-8">
          You Own It, We Sell It; You Seek It, We Have It.
        </p>
        <div className="flex justify-center gap-3">
          <button className="bg-[#4E7FF1] hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md shadow-blue-200 flex items-center gap-2 transition-all duration-200">
            {isSell ? "Sell Now" : "Browse Now"} ⊞
          </button>
          <button className="border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-200">
            {isSell ? "Run Free Valuation" : "Get Started"}
          </button>
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    title: "Smart AI Buyer–Seller Matching",
    points: [
      "Matches sellers with verified, high-intent buyers",
      "Considers industry, location, and deal size",
      "Improves deal speed with relevant recommendations",
    ],
  },
  {
    title: "Business Valuation Tools",
    points: [
      "Built-in full Value Calculator (SDE-based)",
      "Supports multiple broker valuation per share",
      "Clear breakdown of estimated market value",
    ],
  },
  {
    title: "Buy Shares / Fractional Ownership",
    points: [
      "Buyers can purchase partial ownership instead of acquiring the whole business",
      "Digital share agreements and legally documented ownership transfers",
    ],
  },
  {
    title: "Virtual Business Tours",
    points: [
      "Showcase your business premises, operations, and assets with virtual tours",
      "Browse listings virtually from anywhere, reducing unnecessary physical visits",
      "Access is granted only to verified buyers keeping sensitive info secure",
    ],
  },
  {
    title: "Secure Communication & Confidentiality",
    points: [
      "In-app private messaging system",
      "NDAs accepted before sensitive file sharing",
      "Improves deal speed with relevant recommendations for buyer-seller communication",
    ],
  },
  {
    title: "Financial Transparency Dashboard",
    points: [
      "Displays ROI, revenue, expenses, and profit insights",
      "Supports multiple broker valuations",
      "Downloadable financial summaries",
    ],
  },
  {
    title: "Verified Buyer & Seller Profiles",
    points: [
      "Buyer qualification checks (budget & funding source)",
      "Fraud detection to improve credibility",
      "Identity verification system",
    ],
  },
  {
    title: "Streamlined Closing & Payment Tracking",
    points: [
      "Digital contract signing support",
      "Milestone-based payment tracking",
      "Clear transaction status updates",
    ],
  },
];

const FeaturesGrid = () => (
  <section className="max-w-7xl mx-auto px-6 py-16">
    <div className="text-center mb-10">
      <h2 className="text-xl headings font-black text-slate-900 leading-snug">
        A Comprehensive Set of Features to Help<br />you Buy and Sell Online Businesses
      </h2>
    </div>
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-16">
      {features.map((f) => (
        // <div
        //   key={f.title}
        //   className="relative bg-[#F8F8F8] rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] xl:w-[240px] flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
        // >

        <div key = {f.title} 
        className="relative bg-[#F8F8F8] rounded-[2rem] 
shadow-[0_20px_40px_rgba(0,0,0,0.08),_0_8px_16px_rgba(0,0,0,0.06)] 
border border-slate-100 p-8 w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] xl:w-[240px] 
flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1
        ">
          <div className="absolute -top-6 left-10 w-12 h-12 rounded-full bg-[#5c7ae5] shadow-lg" />
          
          <h4 className="headings text-sm font-bold text-slate-800 mb-6 mt-4 leading-snug min-h-[40px] flex items-center">
            {f.title}
          </h4>

          <ul className="space-y-3 text-left w-full">
            {f.points.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 text-xs mt-0.5">✓</span>
                <span className="text-slate-600 text-[11px] font-medium leading-normal">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

const CTABanner = () => (
  <section className="max-w-7xl mx-auto px-6 pb-16">
    <div className="bg-slate-900 rounded-2xl px-10 py-12 text-center">
      <p className="text-white headings text-xl font-bold mb-6">
        Start your journey with Acquisition Navigator here
      </p>
      <div className="flex justify-center gap-3">
        <button className="bg-[#4E7FF1] hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md shadow-blue-900/40 flex items-center gap-2 transition-all duration-200">
          Sell Now ⊞
        </button>
        <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-200">
          Run Free Valuation
        </button>
      </div>
    </div>
  </section>
);

export const AboutPage = () => {
  const [mode, setMode] = useState("sell");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <ModeToggle mode={mode} setMode={setMode} />
        <SellHeroSection mode={mode} />
        <ToolsSection mode={mode} />
        <FeaturesGrid />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};