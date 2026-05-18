"use client";

export function GameModal({
  title,
  subtitle,
  actionLabel,
  onAction,
  variant,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
  variant: "win" | "lose";
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 p-4 backdrop-blur-md">
      <div
        className={`modal-burst w-full max-w-sm rounded-2xl border-2 p-8 text-center ${
          variant === "win"
            ? "border-cyan shadow-[0_0_40px_#00fff5]"
            : "border-magenta shadow-[0_0_40px_#ff00ff]"
        }`}
      >
        <h2
          className={`font-display text-3xl font-black tracking-wider ${
            variant === "win" ? "text-cyan neon-text-cyan" : "text-magenta neon-text-magenta"
          }`}
        >
          {title}
        </h2>
        <p className="mt-3 font-mono text-sm text-white/70">{subtitle}</p>
        <button
          type="button"
          onClick={onAction}
          className={`mt-8 w-full rounded-lg py-3 font-display text-sm font-bold tracking-widest transition-all ${
            variant === "win"
              ? "border border-cyan bg-cyan/20 text-cyan hover:bg-cyan/30"
              : "border border-magenta bg-magenta/20 text-magenta hover:bg-magenta/30"
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
