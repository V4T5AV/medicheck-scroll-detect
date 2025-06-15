
/**
 * Simulates a Gemini API/deep clustering model call for a given image.
 * In real deployment, this function would POST to Gemini & your clustering service.
 */
export type ClusteringResult = {
  clusters: { id: number; x: number; y: number }[];
  medicineType: "Genuine" | "Fake";
  confidence: number; // 0-1
  summary: string;
};

export async function fakeGeminiDetect(image: File): Promise<ClusteringResult> {
  // Fake "processing delay"
  await new Promise((r) => setTimeout(r, 1400));

  // Simulate cluster output (imagine kmeans/autoencode points in 2D)
  const clusters = Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 1,
    x: Math.random() * 10,
    y: Math.random() * 10,
  }));

  // Simulate decision
  const isFake = Math.random() < 0.32;
  const confidence = Math.random() * 0.22 + 0.78;

  return {
    clusters,
    medicineType: isFake ? "Fake" : "Genuine",
    confidence,
    summary: isFake
      ? "Warning: This medicine image has suspicious visual patterns typically found in counterfeit products. Please consult with a professional."
      : "This medicine image appears authentic based on our latest deep learning analysis.",
  };
}
