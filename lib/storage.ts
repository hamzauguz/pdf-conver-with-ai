import { promises as fs } from "fs";
import path from "path";

export type SavedSummary = {
  id: string;
  fileName: string;
  extractedChars: number;
  summary: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "summaries.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function saveSummary(
  entry: Omit<SavedSummary, "id" | "createdAt">
): Promise<SavedSummary> {
  await ensureStore();

  const raw = await fs.readFile(DATA_FILE, "utf8");
  const list: SavedSummary[] = JSON.parse(raw || "[]");

  const record: SavedSummary = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };

  list.unshift(record);
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");

  return record;
}
