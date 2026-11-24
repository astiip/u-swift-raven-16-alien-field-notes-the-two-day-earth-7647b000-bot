// Alien Field Notes: The Two Day Earth Review — make.fun entry.
// Writes a single original alien tourist's review of Earth to
// /output/entry.txt. The review opens with its verdict ("Five stars"),
// names the two-day stay and "the locals", and lands its one joke in
// the last clause: the locals keep saying "we should hang out
// sometime" with no intention of ever doing it. One joke, unexplained,
// from the visitor's outside view of ordinary Earth life.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY_PATH = "/output/entry.txt";
const MAX_CODE_POINTS = 200;

// The entry itself, kept as one clearly named constant so the gate,
// the write, and the read-back all check the exact same value.
const ENTRY_LINE =
  "Five stars: two days on Earth, and the locals still say 'we should hang out sometime' with no intention of ever doing it.";

// Gate check, done before writing: the line must be one non-blank
// line of 1-200 Unicode code points, ending with a full stop, with
// no edge or double spaces. Each failure names the rule it broke,
// so a bad line fails loudly instead of shipping silently.
function validateEntryLine(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Entry rejected: line must not be blank.");
  }
  const codePointCount = [...line].length;
  if (codePointCount < 1 || codePointCount > MAX_CODE_POINTS) {
    throw new Error(
      `Entry rejected: line must be 1-${MAX_CODE_POINTS} Unicode code points, got ${codePointCount}.`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error(
      "Entry rejected: line must be a single line with no newline.",
    );
  }
  if (/[\u0000-\u001F\u007F]/.test(line)) {
    throw new Error(
      "Entry rejected: line must not contain control characters (U+0000-U+001F, U+007F).",
    );
  }
  if (!line.endsWith(".")) {
    throw new Error("Entry rejected: line must end with a full stop.");
  }
  if (line !== line.trim() || line.includes("  ")) {
    throw new Error(
      "Entry rejected: line must be tightly worded, no leading/trailing or double spaces.",
    );
  }
}

validateEntryLine(ENTRY_LINE);

mkdirSync("/output", { recursive: true });
writeFileSync(ENTRY_PATH, ENTRY_LINE, "utf8");

// Read-back verification: the file on disk must be byte for byte the
// line the gate checked above, so a silent write failure can never
// ship a different (or empty) entry to the judge.
const written = readFileSync(ENTRY_PATH, "utf8");
if (written !== ENTRY_LINE) {
  throw new Error("Read-back mismatch: /output/entry.txt is not the entry line.");
}
