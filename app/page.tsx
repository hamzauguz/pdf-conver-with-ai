"use client";

import { FormEvent, useState } from "react";

type SummarizeResult = {
  fileName: string;
  extractedChars: number;
  summary: string;
  savedId: string;
};
//
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummarizeResult | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError("Please choose a PDF file first.");
      return;
    }

    setLoading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/summarize", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize PDF.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-sm font-medium tracking-wide text-teal-700">
          PDF Summarizer
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Upload a PDF, get a short summary
        </h1>
        <p className="text-zinc-600">
          Extracts text from your PDF and returns a concise AI summary.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center transition hover:border-teal-500 hover:bg-teal-50/40">
          <span className="text-sm font-medium text-zinc-800">
            {file ? file.name : "Choose a PDF file"}
          </span>
          <span className="text-xs text-zinc-500">Max 10 MB</span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={loading}
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setError(null);
              setResult(null);
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Summarizing…" : "Summarize PDF"}
        </button>
      </form>

      {loading && (
        <div
          className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900"
          role="status"
        >
          Extracting text and generating summary…
        </div>
      )}

      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {result && !loading && (
        <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-zinc-900">Summary</h2>
            <p className="text-xs text-zinc-500">
              {result.fileName} · {result.extractedChars.toLocaleString()} chars
            </p>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
            {result.summary}
          </p>
          <p className="text-xs text-zinc-400">Saved as {result.savedId}</p>
        </section>
      )}
    </main>
  );
}
