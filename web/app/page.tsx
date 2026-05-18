import { CheckInPanel } from "@/components/checkin/CheckInPanel";
import { HangmanGame } from "@/components/game/HangmanGame";
import { WalletBar } from "@/components/wallet/WalletBar";

export default function Home() {
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col overflow-x-hidden">
      <WalletBar />
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 pb-[env(safe-area-inset-bottom)]">
        <p className="font-mono text-[10px] leading-relaxed text-white/40">
          Decode corrupted signals. Swipe the glyph field — never tap keys.
        </p>
        <CheckInPanel />
        <HangmanGame />
      </main>
    </div>
  );
}
