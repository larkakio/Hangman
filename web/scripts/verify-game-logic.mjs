/** @typedef {{ word: string; guessed: Set<string>; wrongCount: number; maxWrong: number; phase: string }} State */

const POOL = ["CYBER", "NODE", "WIFI", "HACK", "BYTE"];

function createState(level, used = []) {
  const available = POOL.filter((w) => !used.includes(w));
  const word = available[0] ?? POOL[0];
  return { word, guessed: new Set(), wrongCount: 0, maxWrong: 8, phase: "playing", level };
}

function guess(state, letter) {
  if (state.guessed.has(letter)) return state;
  const guessed = new Set(state.guessed);
  guessed.add(letter);
  const inWord = state.word.includes(letter);
  const wrongCount = inWord ? state.wrongCount : state.wrongCount + 1;
  let phase = "playing";
  if ([...state.word].every((c) => guessed.has(c))) phase = "won";
  else if (wrongCount >= state.maxWrong) phase = "lost";
  return { ...state, guessed, wrongCount, phase };
}

let s = createState(1);
for (const ch of s.word) s = guess(s, ch);
if (s.phase !== "won") {
  console.error("FAIL win");
  process.exit(1);
}
const s2 = createState(2, [s.word]);
if (s2.level !== 2 || s2.word === s.word) {
  console.error("FAIL level2", s2);
  process.exit(1);
}
console.log("OK:", s.word, "-> level 2:", s2.word);
