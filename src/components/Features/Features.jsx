import { FeatureCard } from "./FeatureCard/FeatureCard";
import FeatureOneImg from "../../assets/images/feature1.png";
import FeatureTwoImg from "../../assets/images/feature2.png";
import FeatureThreeImg from "../../assets/images/feature3.png";

export const Features = () => {
  const features = [
    { image: FeatureOneImg, title: "Fast-Track Your Acquisition Journey", description: "The modern way to buy and sell businesses / Shares. Our platform connects credible buyers and sellers, offering a streamlined, secure, and efficient experience from discovery to deal." },
    { image: FeatureTwoImg,  title: "Find the Perfect Deal, Faster", description: "Leverage advanced filters and personalized deal alerts. Tailor your search to match industries, location, size, and price—unlock the right opportunities effortlessly." },
    { image: FeatureThreeImg, title: "Your Complete Acquisition Command Center", description: "Streamline every step with our end-to-end Deal Manager. From signing NDAs to final negotiations, manage documents, communications, and tasks all in one place." },
  ];
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-stretch">
        {features.map((f) => <FeatureCard key={f.title} {...f} />)}
      </div>
    </section>
  );
}
 