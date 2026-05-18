"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { isVowel, normalizeLetter } from "@/lib/game/engine";
import type { LetterFilter } from "@/lib/game/types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const COLS = 6;
const FLING_VELOCITY = 0.35;

type Cell = { letter: string; row: number; col: number };

function buildGrid(): Cell[] {
  return ALPHABET.map((letter, i) => ({
    letter,
    row: Math.floor(i / COLS),
    col: i % COLS,
  }));
}

const GRID = buildGrid();

export function SwipeLetterField({
  usedLetters,
  onGuess,
  disabled,
}: {
  usedLetters: Set<string>;
  onGuess: (letter: string) => void;
  disabled?: boolean;
}) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [filter, setFilter] = useState<LetterFilter>("all");
  const pointerStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null);

  const orderedLetters = useMemo(() => {
    return GRID.filter(({ letter }) => {
      if (filter === "vowels") return isVowel(letter);
      if (filter === "consonants") return !isVowel(letter);
      return true;
    });
  }, [filter]);

  const letterIndex = useMemo(() => {
    const map = new Map<string, number>();
    orderedLetters.forEach((c, i) => map.set(c.letter, i));
    return map;
  }, [orderedLetters]);

  const hitTest = useCallback(
    (clientX: number, clientY: number): string | null => {
      const el = fieldRef.current;
      if (!el) return null;
      const cells = el.querySelectorAll<HTMLElement>("[data-letter]");
      for (const cell of cells) {
        const rect = cell.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        if (dist < Math.max(rect.width, rect.height) * 0.55) {
          return cell.dataset.letter ?? null;
        }
      }
      return null;
    },
    [],
  );

  const cycleHighlight = useCallback(
    (direction: 1 | -1) => {
      const letters = orderedLetters.map((c) => c.letter);
      if (letters.length === 0) return;
      const currentIdx = highlight ? (letterIndex.get(highlight) ?? 0) : 0;
      const next =
        (currentIdx + direction + letters.length) % letters.length;
      setHighlight(letters[next] ?? null);
    },
    [highlight, letterIndex, orderedLetters],
  );

  const submitLetter = useCallback(
    (letter: string | null) => {
      if (!letter || disabled) return;
      const norm = normalizeLetter(letter);
      if (!norm || usedLetters.has(norm)) return;
      onGuess(norm);
      setHighlight(null);
    },
    [disabled, onGuess, usedLetters],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    fieldRef.current?.setPointerCapture(e.pointerId);
    pointerStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    lastPointer.current = { ...pointerStart.current };
    const letter = hitTest(e.clientX, e.clientY);
    if (letter) setHighlight(letter);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (disabled || !pointerStart.current) return;
    const letter = hitTest(e.clientX, e.clientY);
    if (letter) setHighlight(letter);
    lastPointer.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (disabled) return;
    const start = pointerStart.current;
    const end = lastPointer.current ?? {
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
    };
    pointerStart.current = null;
    lastPointer.current = null;

    if (start) {
      const dt = Math.max(end.t - start.t, 1);
      const vx = (end.x - start.x) / dt;
      const vy = (end.y - start.y) / dt;

      if (Math.abs(vx) > FLING_VELOCITY && Math.abs(vx) > Math.abs(vy)) {
        cycleHighlight(vx > 0 ? 1 : -1);
        return;
      }
      if (Math.abs(vy) > FLING_VELOCITY && Math.abs(vy) > Math.abs(vx)) {
        setFilter((f) => {
          if (vy < 0)
            return f === "all" ? "vowels" : f === "vowels" ? "consonants" : "all";
          return f === "all" ? "consonants" : f === "consonants" ? "vowels" : "all";
        });
        return;
      }
    }

    const letter = highlight ?? hitTest(e.clientX, e.clientY);
    submitLetter(letter);
  };

  const filterLabel =
    filter === "all" ? "ALL" : filter === "vowels" ? "VOWELS" : "CONSONANTS";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1 text-[10px] tracking-[0.2em] text-cyan/70">
        <span>SWIPE FIELD</span>
        <span className="neon-flicker text-magenta">{filterLabel}</span>
      </div>
      <div
        ref={fieldRef}
        className="swipe-field touch-none select-none rounded-xl border border-cyan/30 bg-void/80 p-2 backdrop-blur-sm"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="grid grid-cols-6 gap-1.5">
          {GRID.map(({ letter, row, col }) => {
            const used = usedLetters.has(letter);
            const hiddenByFilter =
              filter === "vowels"
                ? !isVowel(letter)
                : filter === "consonants"
                  ? isVowel(letter)
                  : false;
            const active = highlight === letter;

            return (
              <div
                key={letter}
                data-letter={letter}
                data-row={row}
                data-col={col}
                className={[
                  "flex h-10 items-center justify-center rounded-md border font-mono text-sm font-bold transition-all duration-150",
                  used
                    ? "border-white/10 bg-white/5 text-white/20 line-through"
                    : hiddenByFilter
                      ? "border-white/5 bg-transparent text-white/15"
                      : active
                        ? "border-cyan bg-cyan/20 text-cyan shadow-[0_0_12px_#00fff5]"
                        : "border-magenta/40 bg-magenta/10 text-magenta hover:border-cyan/60",
                ].join(" ")}
              >
                {letter}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-center text-[10px] text-white/40">
        Drag & release to guess · Fling ↔ cycle · Fling ↕ filter
      </p>
    </div>
  );
}
