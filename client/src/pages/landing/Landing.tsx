import SmoothScrollProvider from "@/components/common/SmoothScrollProvider";
import FeatureSection from "./FeatureSection";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import OrbitalSection from "./OrbitalSection";
import Footer from "./Footer";
import FaqSection from "./FAQSection";
const Landing = () => {
  return (
    <div className="w-full h-full bg-gradient-to-r from-[#161616] to-black">
      <div className="relative w-full flex flex-col justify-center items-center">
        <SmoothScrollProvider />
        <Navbar />
        <HeroSection />
        <FeatureSection />
        <FaqSection />
        <OrbitalSection />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
