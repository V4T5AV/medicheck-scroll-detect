import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import MedicineDropzone from "../components/MedicineDropzone";
import AnimatedSection from "../components/ui/AnimatedSection";
import ImageAnalysis from "../components/ImageAnalysis";
import { fakeGeminiDetect, realGeminiDetect, ClusteringResult } from "../utils/fakeGemini";

const Index = () => {
  const [uploaded, setUploaded] = useState<File | null>(null);
  const [result, setResult] = useState<ClusteringResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem("gemini_api_key") || "");
  const [apiError, setApiError] = useState<string | null>(null);

  // Save API key to local storage upon change
  useEffect(() => {
    if (geminiApiKey) localStorage.setItem("gemini_api_key", geminiApiKey);
  }, [geminiApiKey]);

  async function handleImage(file: File) {
    setUploaded(file);
    setResult(null);
    setApiError(null);
    setLoading(true);
    try {
      let res: ClusteringResult;
      if (geminiApiKey) {
        res = await realGeminiDetect(file, geminiApiKey);
      } else {
        res = await fakeGeminiDetect(file); // fallback to mock if no key
      }
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

          {/* Gemini API Key input */}
          <div className="mb-4 w-full max-w-md">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Paste your Gemini API Key here..."
              className="w-full px-3 py-2 border border-cyan-200 rounded focus:outline-none focus:border-cyan-400 text-xs"
              autoComplete="off"
            />
            <span className="text-[10px] text-gray-400 pl-1">
              <a
                href="https://ai.google.dev/gemini-api/docs/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-cyan-600 hover:text-cyan-900"
              >
                Where to get an API key?
              </a>
            </span>
          </div>

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
