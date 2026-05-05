import Appollo from "../../assets/images/home/Apollo.Io.png";
import ClouseGuard from "../../assets/images/home/ClauseGuard.png";
import Diedilio from "../../assets/images/home/Duedilio.png";
import LeagalEase from "../../assets/images/home/LegalEase.png";
import LexsureeLegal from "../../assets/images/home/lexsurelegal.png";
import NDAWorks from "../../assets/images/home/NDAWorks.png";
import TrustLawAdvisors from "../../assets/images/home/TrsutlawAdvisors.png";

export const LogoBar = () => {
  const logoImages = [Appollo, ClouseGuard, Diedilio, LeagalEase, LexsureeLegal, NDAWorks, TrustLawAdvisors];
  return (
    <div className="bg-[#4E7FF1] py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center sm:justify-around flex-wrap gap-x-4 gap-y-3">
        {logoImages.map((logo, index) => (
          <img key={index} src={logo} alt="Partner" className="h-3.5 sm:h-4 w-auto max-w-[4.5rem] sm:max-w-none object-contain opacity-90" />
        ))}
      </div>
    </div>
  );
}