"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createInitialState,
  defaultProgress,
  getDisplayWord,
  guessLetter,
} from "@/lib/game/engine";
import { loadProgress, saveProgress } from "@/lib/game/progress";
import type { GameState } from "@/lib/game/types";
import { GameModal } from "./GameModal";
import { HangmanGallows } from "./HangmanGallows";
import { SwipeLetterField } from "./SwipeLetterField";
import { TutorialOverlay } from "./TutorialOverlay";

export function HangmanGame() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(defaultProgress);
  const [game, setGame] = useState<GameState | null>(null);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [shake, setShake] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    setGame(createInitialState(p.currentLevel, []));
    setShowTutorial(!p.tutorialSeen);
    setMounted(true);
  }, []);

  const handleGuess = useCallback(
    (letter: string) => {
      if (!game || game.phase !== "playing") return;

      const prevWrong = game.wrongCount;
      const next = guessLetter(game, letter);
      const wasWrong = next.wrongCount > prevWrong;

      if (wasWrong) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }

      setGame(next);

      if (next.phase === "won") {
        setShowWinModal(true);
      }
    },
    [game],
  );

  const handleWinContinue = useCallback(() => {
    if (!game) return;
    const newLevel = game.level + 1;
    const updated = {
      ...progress,
      currentLevel: newLevel,
      highestCleared: Math.max(progress.highestCleared, game.level),
      wins: progress.wins + 1,
    };
    setProgress(updated);
    saveProgress(updated);
    setUsedWords((w) => [...w, game.word]);
    setGame(createInitialState(newLevel, [...usedWords, game.word]));
    setShowWinModal(false);
  }, [game, progress, usedWords]);

  const handleRetry = useCallback(() => {
    if (!game) return;
    const updated = { ...progress, losses: progress.losses + 1 };
    setProgress(updated);
    saveProgress(updated);
    setGame(createInitialState(game.level, usedWords));
  }, [game, progress, usedWords]);

  const dismissTutorial = useCallback(() => {
    const updated = { ...progress, tutorialSeen: true };
    setProgress(updated);
    saveProgress(updated);
    setShowTutorial(false);
  }, [progress]);

  if (!mounted || !game) {
    return (
      <div className="flex flex-1 items-center justify-center font-mono text-cyan/60">
        LOADING SIGNAL...
      </div>
    );
  }

  const display = getDisplayWord(game);
  const strikesLeft = game.maxWrong - game.wrongCount;

  return (
    <>
      {showTutorial && <TutorialOverlay onDismiss={dismissTutorial} />}

      {showWinModal && (
        <GameModal
          variant="win"
          title="LEVEL CLEARED"
          subtitle={`Word decoded: ${game.word} · Advancing to Level ${game.level + 1}`}
          actionLabel="NEXT SIGNAL"
          onAction={handleWinContinue}
        />
      )}

      {game.phase === "lost" && !showWinModal && (
        <GameModal
          variant="lose"
          title="SIGNAL LOST"
          subtitle={`The word was ${game.word}. Retry Level ${game.level}?`}
          actionLabel="RETRY"
          onAction={handleRetry}
        />
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="rounded-lg border border-cyan/40 bg-cyan/5 px-3 py-1.5">
            <span className="font-mono text-[10px] text-cyan/60">LEVEL</span>
            <p className="font-display text-xl font-bold text-cyan">
              {String(game.level).padStart(2, "0")}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] text-magenta/60">STRIKES</span>
            <p className="font-display text-xl font-bold text-magenta">
              {strikesLeft}
            </p>
          </div>
        </div>

        <div className="word-display flex flex-wrap justify-center gap-2 py-2">
          {display.split(" ").map((segment, si) => (
            <div key={si} className="flex gap-1.5">
              {segment.split("").map((ch, i) => (
                <span
                  key={`${si}-${i}`}
                  className={`flex h-12 w-9 items-center justify-center rounded border font-mono text-lg font-bold ${
                    ch === "_"
                      ? "border-cyan/30 bg-void text-cyan/20"
                      : "border-terminal bg-terminal/10 text-terminal neon-text-green"
                  }`}
                >
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <HangmanGallows wrongCount={game.wrongCount} shake={shake} />
        </div>

        <div className="flex flex-wrap justify-center gap-1 min-h-6">
          {[...game.guessed].sort().map((l) => (
            <span
              key={l}
              className={`rounded px-1.5 py-0.5 font-mono text-xs ${
                game.word.includes(l)
                  ? "bg-terminal/20 text-terminal"
                  : "bg-magenta/20 text-magenta line-through"
              }`}
            >
              {l}
            </span>
          ))}
        </div>

        <SwipeLetterField
          usedLetters={game.guessed}
          onGuess={handleGuess}
          disabled={game.phase !== "playing"}
        />
      </section>
    </>
  );
}
