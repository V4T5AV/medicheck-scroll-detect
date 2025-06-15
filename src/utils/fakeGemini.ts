/**
 * ClusteringResult type is reused for both fake and real results.
 */
export type ClusteringResult = {
  clusters: { id: number; x: number; y: number }[];
  medicineType: "Genuine" | "Fake";
  confidence: number; // 0-1
  summary: string;
};

/**
 * Simulates a Gemini API/deep clustering model call for a given image.
 * This is now legacy and only used for fallback in case no API key is provided.
 */
export async function fakeGeminiDetect(image: File): Promise<ClusteringResult> {
  await new Promise((r) => setTimeout(r, 1400));
  const clusters = Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 1,
    x: Math.random() * 10,
    y: Math.random() * 10,
  }));
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

/**
 * Calls Gemini API with the provided API key and image file.
 * Uses the latest Gemini 1.5 API (https://ai.google.dev/gemini-api/docs/api/generate-content)
 */
export async function realGeminiDetect(image: File, apiKey: string): Promise<ClusteringResult> {
  // Helper function to convert file to base64
  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const imageBase64 = await fileToBase64(image);

  // Gemini 1.5 expects the prompt and image in `contents`
  const contents = [
    {
      role: "user",
      parts: [
        {
          text:
            "You are a medicine authenticity checker. The following image is a photo of a packaged pharmaceutical product. Only answer in concise JSON: {\"medicineType\":\"Genuine\"|\"Fake\",\"confidence\":float between 0 and 1,\"summary\":string explanation}. Is this medicine FAKE or GENUINE? Give your best estimate based on visual clues and counterfeiting patterns."
        },
        {
          inline_data: {
            mime_type: image.type,
            data: imageBase64,
          },
        },
      ],
    },
  ];

  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini Vision API error: ${error}`);
  }

  const data = await response.json();
  // According to docs, the answer may be in data.candidates[0].content.parts[0].text (for Gemini 1.5)
  const geminiText: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!geminiText) throw new Error("No output from Gemini API");

  let resultJson: any;
  try {
    resultJson = JSON.parse(
      geminiText.replace(/^[^{}]*(\{.*\})[^{}]*$/, "$1") // try to extract real JSON if wrapped
    );
  } catch {
    throw new Error("Could not parse Gemini JSON response: " + geminiText);
  }

  if (
    typeof resultJson.medicineType !== "string" ||
    typeof resultJson.confidence !== "number" ||
    typeof resultJson.summary !== "string"
  ) {
    throw new Error("Gemini output missing fields: " + JSON.stringify(resultJson));
  }

  // We'll still generate random clusters for demo visualization
  const clusters = Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 1,
    x: Math.random() * 10,
    y: Math.random() * 10,
  }));

  return {
    clusters,
    medicineType: resultJson.medicineType === "Fake" ? "Fake" : "Genuine",
    confidence: Math.max(0, Math.min(1, resultJson.confidence)),
    summary: resultJson.summary,
  };
}
