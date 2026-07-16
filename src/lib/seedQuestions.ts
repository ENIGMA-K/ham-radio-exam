import type { Question } from "@/models/Question";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function getTransformedQuestions(): Promise<Question[]> {
  const res = await fetch(`${BASE}/data/questions.json`);
  if (!res.ok) {
    throw new Error(`Failed to load questions: ${res.status}`);
  }
  // The JSON is already transformed by the preprocess script
  return res.json();
}
