# PDF Summarizer (MVP)

Upload a PDF → extract text → generate a short AI summary → show it on screen.

## Stack

- Next.js (React + TypeScript)
- REST API route (`POST /api/summarize`)
- `unpdf` for text extraction
- Dummy AI response (ready to swap for OpenAI / Claude)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Flow

1. User uploads a PDF
2. Server extracts text
3. Dummy AI returns a concise summary (with simulated latency)
4. Result is saved to `data/summaries.json` and shown in the UI

Loading and error states are handled on the frontend.
# pdf-conver-with-ai
