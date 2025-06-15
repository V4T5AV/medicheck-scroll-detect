
import { ArrowDown } from "lucide-react";
import AnimatedSection from "./ui/AnimatedSection";

const HeroSection = () => (
  <section className="w-full flex flex-col justify-center items-center py-24 md:py-32 bg-gradient-to-r from-[#0b1934] to-[#102e61] min-h-[50vh] relative overflow-hidden">
    <AnimatedSection>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-6">
        Fake Medicine Detection
      </h1>
      <p className="text-lg md:text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto">
        Instantly analyze medicine images with real deep learning—<span className="text-cyan-300 font-semibold">Gemini</span> + AI clustering (KMeans, Autoencoder).
        <br className="hidden md:block" />
        Protect health. Detect fakes at a glance.
      </p>
    </AnimatedSection>
    {/* Scroll down cue */}
    <div className="absolute left-1/2 bottom-10 -translate-x-1/2 flex flex-col items-center animate-bounce pointer-events-none">
      <ArrowDown size={36} className="text-cyan-400 opacity-80" />
      <div className="mt-2 h-1 w-8 bg-cyan-400/40 rounded-full"/>
    </div>
  </section>
);

export default HeroSection;
