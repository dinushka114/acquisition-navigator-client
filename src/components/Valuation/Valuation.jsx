import { CalculatorCard } from "../CalculatorCard/CalculatorCard";
import CalculatorImage from "../../assets/images/calculator.png"
import CalOne from "../../assets/images/cal1.png";
import CalTwo from "../../assets/images/cal2.png";
import CalThree from "../../assets/images/cal3.png";
import CalFour from "../../assets/images/cal4.png";

export const Valuation = () => {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="min-w-0 w-full max-w-lg justify-self-start mx-auto md:mx-0">
            <div className="relative max-w-md w-full mx-auto md:mx-0">
              <img
                src={CalculatorImage}
                alt="Calculator"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>

          <div className="min-w-0 w-full max-w-lg justify-self-start md:justify-self-end text-center md:text-left mx-auto md:mx-0">
            <p className="text-xs font-bold tracking-widest text-blue-600 mb-2">
              VALUATION TOOLS
            </p>
            <h2 className="text-3xl sm:text-4xl headings font-extrabold text-slate-900 leading-tight mb-4">
              Know What Your Business is Worth - INSTANTLY!!
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-7">
              Instantly estimate the value of your business with our powerful valuation tools built for business owners, brokers, and buyers alike. Whether you're preparing to sell, exploring your options, or simply curious about your market position, our platform uses real-time data, financial benchmarks, and industry trends to generate accurate and reliable valuations. Get clarity, make informed decisions, and take the guesswork out of your next big move.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalculatorCard img={CalOne} label="Net Working Capital Calculator" />
              <CalculatorCard img={CalTwo} label="Exit Value Calculator" />
              <CalculatorCard img={CalThree} label="Deal Structure & Payout Calculator" />
              <CalculatorCard img={CalFour} label="Buying Power Calculator" />
            </div>

            <button
              type="button"
              className="mt-7 bg-[#4E7FF1] hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-lg shadow-blue-200 inline-flex items-center justify-center gap-2 transition-all duration-200 w-full sm:w-auto"
            >
              Try the valuation tools →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}