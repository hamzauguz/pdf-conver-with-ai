/**
 * Dummy AI summarizer for the MVP demo.
 * Swap this with OpenAI / Claude when the client provides an API key.
 */
export async function summarizeText(text: string): Promise<string> {
  // Simulate network / LLM latency
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const cleaned = text.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    throw new Error("No readable text found in the PDF.");
  }

  const preview = cleaned.slice(0, 280);
  const wordCount = cleaned.split(" ").length;

  return [
    "Summary (demo AI response):",
    "",
    `This document contains approximately ${wordCount} words.`,
    `Key excerpt: "${preview}${cleaned.length > 280 ? "…" : ""}"`,
    "",
    "Overall, the PDF covers the topics above. Connect an OpenAI or Claude API key to replace this with a real LLM summary.",
  ].join("\n");
}
