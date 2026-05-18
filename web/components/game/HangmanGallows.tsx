"use client";

const PARTS = [
  { d: "M 20 180 L 20 40", delay: 0 },
  { d: "M 20 40 L 100 40", delay: 0.1 },
  { d: "M 100 40 L 100 55", delay: 0.2 },
  { d: "M 100 55 L 100 95", delay: 0.3 },
  { d: "M 100 95 L 75 120", delay: 0.4 },
  { d: "M 100 95 L 125 120", delay: 0.5 },
  { d: "M 100 95 L 100 145", delay: 0.6 },
  { d: "M 100 145 L 80 175", delay: 0.7 },
  { d: "M 100 145 L 120 175", delay: 0.8 },
];

export function HangmanGallows({
  wrongCount,
  shake,
}: {
  wrongCount: number;
  shake?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 140 190"
      className={`h-36 w-auto ${shake ? "animate-glitch-shake" : ""}`}
      aria-hidden
    >
      <defs>
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {PARTS.slice(0, Math.min(wrongCount + 1, PARTS.length)).map((part, i) => (
        <path
          key={i}
          d={part.d}
          fill="none"
          stroke="url(#wire-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#neon-glow)"
          className="animate-neon-pulse"
          style={{ animationDelay: `${part.delay}s` }}
        />
      ))}
      <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00fff5" />
        <stop offset="50%" stopColor="#ff00ff" />
        <stop offset="100%" stopColor="#39ff14" />
      </linearGradient>
    </svg>
  );
}
