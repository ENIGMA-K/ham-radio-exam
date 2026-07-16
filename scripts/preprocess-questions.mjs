import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const vaultRoot = join(__dirname, "..", "..", "..");

const sourceJSON = join(vaultRoot, "raw", "assets", "业余无线电题库_2026-03-06.json");
const sourceImages = join(vaultRoot, "raw", "assets", "图片");
const destJSON = join(__dirname, "..", "public", "data", "questions.json");
const destImages = join(__dirname, "..", "public", "images");

// Read source JSON handling BOM manually
let raw = readFileSync(sourceJSON, "utf-8");
if (raw.charCodeAt(0) === 0xFEFF) {
  raw = raw.slice(1);
}

const questions = JSON.parse(raw);

const transformed = questions.map((q) => ({
  id: q["题号"],
  stem: q["题干"],
  correctAnswer: q["正确答案"],
  optionA: q["选项A"],
  optionB: q["选项B"],
  optionC: q["选项C"],
  optionD: q["选项D"],
  imageFilename: q["是否包含图片"] || "",
  hasImage: q["是否包含图片"] !== "" && q["是否包含图片"].length > 0,
  categoryA: q["A类"] === 1,
  categoryB: q["B类"] === 1,
  categoryC: q["C类"] === 1,
  questionType: "single",
}));

// Ensure destination directories
mkdirSync(dirname(destJSON), { recursive: true });
mkdirSync(destImages, { recursive: true });

writeFileSync(destJSON, JSON.stringify(transformed, null, 2), "utf-8");
console.log(`Wrote ${transformed.length} questions to ${destJSON}`);

// Copy images
const imageFiles = transformed.filter((q) => q.hasImage).map((q) => q.imageFilename);
let copied = 0;
let missing = 0;

for (const filename of imageFiles) {
  const src = join(sourceImages, filename);
  const dest = join(destImages, filename);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    copied++;
  } else {
    console.warn(`Missing image: ${filename}`);
    missing++;
  }
}

console.log(`Images: ${copied} copied, ${missing} missing`);

// Stats
const aCount = transformed.filter((q) => q.categoryA).length;
const bCount = transformed.filter((q) => q.categoryB).length;
const cCount = transformed.filter((q) => q.categoryC).length;
const imgCount = transformed.filter((q) => q.hasImage).length;

console.log(`Categories: A=${aCount}, B=${bCount}, C=${cCount}, Images=${imgCount}`);
console.log("Done!");
