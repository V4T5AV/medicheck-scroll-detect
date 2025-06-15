
import { ArrowDown } from "lucide-react";
import AnimatedSection from "./ui/AnimatedSection";

const highlights = [
  {
    title: "1. Upload",
    desc: "Drop or choose a medicine photo—quick & private.",
    icon: (
      <span className="inline-block bg-cyan-100 p-2 rounded-full">
        <ArrowDown size={20} className="text-cyan-700" />
      </span>
    ),
  },
  {
    title: "2. Analyze",
    desc: "Deep learning clustering visually inspects your image.",
    icon: (
      <span className="inline-block bg-green-100 p-2 rounded-full">
        <span className="block w-3 h-3 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 rounded-full animate-pulse"></span>
      </span>
    ),
  },
  {
    title: "3. Detect",
    desc: "Instant results: Find out if the medicine is real or fake.",
    icon: (
      <span className="inline-block bg-red-100 p-2 rounded-full">
        <span className="block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </span>
    ),
  },
];

const HeroSection = () => (
  <section className="w-full flex flex-col justify-center items-center py-24 md:py-32 bg-gradient-to-r from-[#0b1934] to-[#102e61] min-h-[50vh] relative overflow-hidden">
    <AnimatedSection>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-6">
        Fake Medicine Detection
      </h1>
      {/* Updated tagline below, Gemini API mention removed */}
      <p className="text-lg md:text-2xl text-white/80 font-light mb-8 max-w-2xl mx-auto">
        Instantly analyze medicine images with deep AI clustering (KMeans, Autoencoder).
        <br className="hidden md:block" />
        Protect health. Detect fakes at a glance.
      </p>
      {/* New Highlights Row */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center pt-2 pb-2 mb-3 w-full max-w-2xl animate-fade-in">
        {highlights.map((step, i) => (
          <div
            key={step.title}
            className="flex flex-row md:flex-col items-center md:items-start bg-white/10 rounded-lg p-3 md:p-5 w-full md:w-56 shadow hover-scale"
          >
            <div className="mb-0 md:mb-2 mr-3 md:mr-0">{step.icon}</div>
            <div>
              <span className="block text-base md:text-lg font-bold text-cyan-200 leading-tight">{step.title}</span>
              <span className="block text-xs md:text-sm text-blue-100/80 font-light">{step.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
    {/* Scroll down cue */}
    <div className="absolute left-1/2 bottom-10 -translate-x-1/2 flex flex-col items-center animate-bounce pointer-events-none">
      <ArrowDown size={36} className="text-cyan-400 opacity-80" />
      <div className="mt-2 h-1 w-8 bg-cyan-400/40 rounded-full"/>
    </div>
  </section>
);

export default HeroSection;

