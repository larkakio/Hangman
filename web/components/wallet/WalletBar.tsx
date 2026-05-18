"use client";

import { useConnect, useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { TARGET_CHAIN_ID } from "@/lib/wagmi/config";

export function WalletBar() {
  const [mounted, setMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const wrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  const sheet = sheetOpen && mounted && (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label="Connect wallet"
      onClick={() => setSheetOpen(false)}
    >
      <div
        className="rounded-t-2xl border-t border-cyan/30 bg-void p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-bold tracking-widest text-cyan">
            CONNECT WALLET
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSheetOpen(false)}
            className="rounded px-2 py-1 text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto">
          {connectors.length === 0 ? (
            <p className="font-mono text-xs text-white/50">
              No wallets detected. Open in a wallet browser or install an extension.
            </p>
          ) : (
            connectors.map((connector) => (
              <button
                key={connector.uid}
                type="button"
                disabled={isConnecting}
                onClick={() => {
                  connect({ connector, chainId: base.id });
                  setSheetOpen(false);
                }}
                className="w-full rounded-lg border border-cyan/30 bg-cyan/5 px-4 py-3 text-left font-mono text-sm text-cyan transition hover:bg-cyan/15 disabled:opacity-50"
              >
                {connector.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="font-display text-sm font-black tracking-[0.15em] text-cyan neon-text-cyan">
          NEON HANGMAN
        </h1>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <span className="hidden font-mono text-[10px] text-white/50 sm:inline">
                {shortAddress}
              </span>
              <button
                type="button"
                onClick={() => disconnect()}
                className="rounded-lg border border-white/20 px-3 py-1.5 font-mono text-[10px] text-white/70"
              >
                DISCONNECT
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="rounded-lg border border-cyan/50 bg-cyan/10 px-3 py-1.5 font-display text-[10px] font-bold tracking-wider text-cyan"
            >
              CONNECT
            </button>
          )}
        </div>
      </header>

      {wrongNetwork && (
        <div className="flex items-center justify-between gap-2 border-b border-hazard/40 bg-hazard/10 px-4 py-2">
          <span className="font-mono text-xs text-hazard">Wrong network</span>
          <button
            type="button"
            disabled={isSwitching}
            onClick={() => switchChain({ chainId: base.id })}
            className="rounded border border-hazard/60 px-2 py-1 font-mono text-[10px] text-hazard disabled:opacity-50"
          >
            Switch to Base
          </button>
        </div>
      )}

      {mounted && sheet && createPortal(sheet, document.body)}
    </>
  );
}
