"use client";

export function TutorialOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-void/85 p-4 pb-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-hazard/50 bg-void/95 p-6 shadow-[0_0_30px_#ffe60040]">
        <h3 className="font-display text-lg font-bold tracking-widest text-hazard">
          SIGNAL TUTORIAL
        </h3>
        <ul className="mt-4 space-y-3 font-mono text-xs text-white/80">
          <li>1. Drag across the glyph field and release to guess a letter.</li>
          <li>2. Fling left/right to cycle highlight without lifting.</li>
          <li>3. Fling up/down to filter vowels or consonants.</li>
        </ul>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 w-full rounded-lg border border-hazard/60 bg-hazard/10 py-3 font-display text-sm font-bold tracking-widest text-hazard"
        >
          ENTER THE GRID
        </button>
      </div>
    </div>
  );
}
