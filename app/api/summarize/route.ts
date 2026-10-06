import { extractText, getDocumentProxy } from "unpdf";
import { summarizeText } from "@/lib/ai";
import { saveSummary } from "@/lib/storage";

export const runtime = "nodejs";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "Please upload a PDF file." },
        { status: 400 }
      );
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return Response.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return Response.json(
        { error: "File is too large. Max size is 10 MB." },
        { status: 400 }
      );
    }

    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocumentProxy(data);
    const { text: extracted } = await extractText(pdf, { mergePages: true });
    const text = (typeof extracted === "string" ? extracted : "").trim();

    if (!text) {
      return Response.json(
        { error: "Could not extract any text from this PDF." },
        { status: 422 }
      );
    }

    const summary = await summarizeText(text);
    const saved = await saveSummary({
      fileName: file.name,
      extractedChars: text.length,
      summary,
    });

    return Response.json({
      fileName: saved.fileName,
      extractedChars: saved.extractedChars,
      summary: saved.summary,
      savedId: saved.id,
      createdAt: saved.createdAt,
    });
  } catch (error) {
    console.error("summarize error:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    return Response.json({ error: message }, { status: 500 });
  }
}
