import { getLevelConfig, pickWordForLevel } from "./words";
import type { GamePhase, GameState } from "./types";

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function normalizeLetter(letter: string): string {
  return letter.toUpperCase().replace(/[^A-Z]/g, "");
}

export function isVowel(letter: string): boolean {
  return VOWELS.has(normalizeLetter(letter));
}

export function createInitialState(
  level: number,
  usedWords: string[] = [],
): GameState {
  const { maxWrong } = getLevelConfig(level);
  const word = pickWordForLevel(level, usedWords);

  return {
    level,
    word,
    guessed: new Set(),
    wrongCount: 0,
    maxWrong,
    phase: "playing",
  };
}

export function getDisplayWord(state: GameState): string {
  return state.word
    .split("")
    .map((ch) => (state.guessed.has(ch) ? ch : "_"))
    .join(" ");
}

export function isWordComplete(state: GameState): boolean {
  return state.word.split("").every((ch) => state.guessed.has(ch));
}

export function guessLetter(
  state: GameState,
  rawLetter: string,
): GameState {
  const letter = normalizeLetter(rawLetter);
  if (!letter || state.phase !== "playing") return state;
  if (state.guessed.has(letter)) return state;

  const guessed = new Set(state.guessed);
  guessed.add(letter);

  const inWord = state.word.includes(letter);
  const wrongCount = inWord ? state.wrongCount : state.wrongCount + 1;

  let phase: GamePhase = "playing";
  if (state.word.split("").every((ch) => guessed.has(ch))) {
    phase = "won";
  } else if (wrongCount >= state.maxWrong) {
    phase = "lost";
  }

  return { ...state, guessed, wrongCount, phase };
}

export const PROGRESS_KEY = "neon-hangman-progress";

export function defaultProgress() {
  return {
    currentLevel: 1,
    highestCleared: 0,
    wins: 0,
    losses: 0,
    tutorialSeen: false,
  };
}
