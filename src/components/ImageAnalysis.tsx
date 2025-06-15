
import { useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Scatter, ScatterChart, ZAxis } from "recharts";
import { CheckCircle, AlertCircle } from "lucide-react";
import AnimatedSection from "./ui/AnimatedSection";
import { ClusteringResult } from "../utils/fakeGemini";

type Props = {
  file: File;
  result: ClusteringResult;
  onReset?: () => void;
};

function readUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}

const ImageAnalysis: React.FC<Props> = ({ file, result, onReset }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    readUrl(file).then((url) => live && setImgUrl(url));
    return () => { live = false; };
  }, [file]);

  // "Cluster" scatter chart, gorgeous and animated
  return (
    <AnimatedSection delay={200}>
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        {/* Image preview */}
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src={imgUrl || ""}
            alt="Uploaded medicine"
            className="rounded-lg shadow-lg max-h-48 object-contain animate-scale-in"
            style={{ width: "100%", minHeight: 180, background: "#f6f9fd" }}
          />
          <button
            className="inline-flex gap-2 items-center px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium transition-colors"
            onClick={onReset}
            style={{ marginTop: 10 }}
          >
            Try Another
          </button>
        </div>
        {/* Analysis */}
        <div className="flex flex-col gap-4 justify-center min-w-0">
          <div className="flex gap-3 items-center">
            {result.medicineType === "Genuine" ? (
              <CheckCircle size={28} className="text-green-500 animate-scale-in" />
            ) : (
              <AlertCircle size={28} className="text-red-500 animate-scale-in" />
            )}
            <span className={`text-xl font-bold ${result.medicineType === "Fake" ? "text-red-600" : "text-green-700"}`}>
              {result.medicineType === "Fake" ? "Fake Medicine Detected" : "Authentic Medicine"}
            </span>
          </div>
          <p className="text-base md:text-lg text-gray-700 mb-2">{result.summary}</p>
          <div className="w-full h-36 mt-2">
            {/* Recharts Scatter Chart for kmeans/autoencoder clusters */}
            <ResponsiveContainer width="98%" height="100%">
              <ScatterChart>
                <CartesianGrid stroke="#dbeafe" />
                <XAxis type="number" dataKey="x" name="Feature X" domain={[0, 10]} hide />
                <YAxis type="number" dataKey="y" name="Feature Y" domain={[0, 10]} hide />
                <ZAxis range={[100,400]}/>
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Clusters"
                  data={result.clusters}
                  fill={result.medicineType === "Fake" ? "#ef4444" : "#0ea5e9"}
                  animationDuration={700}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 items-center">
            <div className={`text-xs rounded-full px-3 py-1 bg-cyan-100 text-cyan-900 font-medium`}>
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </div>
            <div className="text-xs font-mono text-gray-400 select-none">
              Model: KMeans + Autoencoder (mocked)
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

import { useState } from "react";
export default ImageAnalysis;
