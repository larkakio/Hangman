import {
  createInitialState,
  guessLetter,
  getDisplayWord,
} from "../lib/game/engine.ts";

let state = createInitialState(1, []);
const word = state.word;

for (const ch of word) {
  state = guessLetter(state, ch);
}

if (state.phase !== "won") {
  console.error("FAIL: expected win, got", state.phase);
  process.exit(1);
}

const level2 = createInitialState(2, [word]);
if (level2.level !== 2) {
  console.error("FAIL: expected level 2");
  process.exit(1);
}

console.log("OK level1 win:", word, "-> level2 word:", level2.word);
console.log("display:", getDisplayWord(level2).replace(/_/g, "?"));
