export type LetterFilter = "all" | "vowels" | "consonants";

export type GamePhase = "playing" | "won" | "lost";

export interface GameProgress {
  currentLevel: number;
  highestCleared: number;
  wins: number;
  losses: number;
  tutorialSeen: boolean;
}

export interface LevelConfig {
  minLength: number;
  maxLength: number;
  maxWrong: number;
}

export interface GameState {
  level: number;
  word: string;
  guessed: Set<string>;
  wrongCount: number;
  maxWrong: number;
  phase: GamePhase;
}
