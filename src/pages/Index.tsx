
import { useState } from "react";
import HeroSection from "../components/HeroSection";
import MedicineDropzone from "../components/MedicineDropzone";
import AnimatedSection from "../components/ui/AnimatedSection";
import ImageAnalysis from "../components/ImageAnalysis";
import { fakeGeminiDetect, ClusteringResult } from "../utils/fakeGemini";

const Index = () => {
  const [uploaded, setUploaded] = useState<File | null>(null);
  const [result, setResult] = useState<ClusteringResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleImage(file: File) {
    setUploaded(file);
    setResult(null);
    setLoading(true);
    // Hidden call to the “Gemini” (mocked) model for demo
    const result = await fakeGeminiDetect(file);
    setResult(result);
    setLoading(false);
  }

  function resetAll() {
    setUploaded(null);
    setResult(null);
    setLoading(false);
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <HeroSection />
      <AnimatedSection delay={260}>
        <section className="w-full flex flex-col items-center mt-6 md:mt-12 mb-10">
          <div className="text-2xl font-semibold mb-3 text-gray-800">Detect Counterfeit Medicines Instantly</div>
          <div className="mb-7 text-base text-gray-500">
            Drop a medicine photo below or click to browse—no info stored.
            <br />
            <span className="text-xs text-cyan-600">Powered by latest Gemini AI and deep clustering.</span>
          </div>
          {!uploaded && (
            <MedicineDropzone onImageUpload={handleImage} uploading={loading} />
          )}
        </section>
      </AnimatedSection>
      {/* Show ImageAnalysis (with clustering and prediction) if we have a file and a result */}
      {uploaded && result && (
        <ImageAnalysis file={uploaded} result={result} onReset={resetAll} />
      )}
      {/* Subtle footer for credits */}
      <footer className="w-full border-t mt-32 py-8 bg-white/90 flex flex-col md:flex-row gap-2 items-center justify-between px-6">
        <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Fake Medicine Detection Demo</span>
        <span className="text-xs text-gray-300">
          Deep Learning Clustering UI
        </span>
      </footer>
    </main>
  );
};

export default Index;
