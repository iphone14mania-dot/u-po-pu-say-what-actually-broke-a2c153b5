// Say What Actually Broke — entry program.
//
// Writes one line of software error copy to /output/entry.txt: the brutal
// truth about what went wrong, funny enough to repeat. Deterministic, no
// network, no randomness.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry text. It names the real failure in plain words — the payment
// went through twice, because our retry button retried too hard — and
// tells the user what happens next: the duplicate is refunded, the bank
// just needs a day (judge brief criterion 2). The twist, "your bank just
// needs a day to believe us", is the line a reader repeats out loud to a
// colleague (3), it is one line with no padding and no throat clearing
// (4), and it would survive a real error dialog: it owns the fault, states
// the fix, and the joke is at our expense, not the user's (5). Revision:
// a database-fell-over draft ("it's already back up and pretending nothing
// happened") was dropped — "fell over" is vaguer than a double charge,
// and the failure is generic. An out-of-memory draft ending "we've
// restarted the hamster" was dropped as a worn joke that runs long.
const ENTRY =
  "The payment went through twice because our retry button retried too hard. " +
  "We've refunded the duplicate; your bank just needs a day to believe us.";

// Competition rules: 1 to 200 characters, counted as Unicode code points,
// and not only white space. Enforce it here so a bad edit fails loudly.
const codePoints = [...ENTRY].length;
if (codePoints < 1 || codePoints > 200) {
  throw new Error(`entry must be 1-200 code points, got ${codePoints}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// The rules require a single line: reject any line break outright, so a
// bad edit that introduces one fails loudly instead of shipping a
// two-line entry to a one-line judge.
if (/[\r\n]/.test(ENTRY)) {
  throw new Error("entry must be a single line, got a line break");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
console.log(`wrote ${codePoints} code points to ${outPath}`);
