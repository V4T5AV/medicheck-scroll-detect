
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import MedicineDropzone from "../components/MedicineDropzone";
import AnimatedSection from "../components/ui/AnimatedSection";
import ImageAnalysis from "../components/ImageAnalysis";
import { fakeGeminiDetect, realGeminiDetect, ClusteringResult } from "../utils/fakeGemini";

const GEMINI_API_KEY = "AIzaSyBYtqx1zqn1E7X6a46Yl08JDzv_6_5nWw8"; // HIDDEN: Use this key automatically; do not display

const Index = () => {
  const [uploaded, setUploaded] = useState<File | null>(null);
  const [result, setResult] = useState<ClusteringResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // On mount, save the API key to localStorage to prevent showing in UI
  useEffect(() => {
    // Save to localStorage (hidden, not shown in UI)
    if (GEMINI_API_KEY) localStorage.setItem("gemini_api_key", GEMINI_API_KEY);
  }, []);

  async function handleImage(file: File) {
    setUploaded(file);
    setResult(null);
    setApiError(null);
    setLoading(true);
    try {
      // Always use the real Gemini API with the key
      const res = await realGeminiDetect(file, GEMINI_API_KEY);
      setResult(res);
    } catch (err: any) {
      setApiError(
        err?.message?.toString() || "Error communicating with Gemini API."
      );
    }
    setLoading(false);
  }

  function resetAll() {
    setUploaded(null);
    setResult(null);
    setLoading(false);
    setApiError(null);
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <HeroSection />
      <AnimatedSection delay={260}>
        <section className="w-full flex flex-col items-center mt-6 md:mt-12 mb-10">
          <div className="text-2xl font-semibold mb-3 text-gray-800">
            Detect Counterfeit Medicines Instantly
          </div>
          <div className="mb-7 text-base text-gray-500">
            Drop a medicine photo below or click to browse—no info stored.
            <br />
            <span className="text-xs text-cyan-600">
              Powered by latest AI and deep clustering.
            </span>
          </div>
          {/* Gemini API Key input has been removed/hidden as per user request */}
          {apiError && (
            <div className="mb-2 w-full max-w-md">
              <div className="text-xs text-red-600 bg-red-50 rounded p-2 font-mono">
                {apiError}
              </div>
            </div>
          )}

          {!uploaded && (
            <MedicineDropzone onImageUpload={handleImage} uploading={loading} />
          )}
        </section>
      </AnimatedSection>
      {/* Show ImageAnalysis if we have a file and a result */}
      {uploaded && result && (
        <ImageAnalysis file={uploaded} result={result} onReset={resetAll} />
      )}
      {/* Subtle footer for credits */}
      <footer className="w-full border-t mt-32 py-8 bg-white/90 flex flex-col md:flex-row gap-2 items-center justify-between px-6">
        <span className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Fake Medicine Detection Demo
        </span>
        <span className="text-xs text-gray-300">Deep Learning Clustering UI</span>
      </footer>
    </main>
  );
};

export default Index;

