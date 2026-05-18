"use client";

import { useAccount, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { dailyCheckInAbi } from "@/lib/contracts/abi";
import { TARGET_CHAIN_ID } from "@/lib/wagmi/config";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS as `0x${string}` | undefined;

export function CheckInPanel() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const { data: canCheckIn, refetch: refetchCan } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: dailyCheckInAbi,
    functionName: "canCheckIn",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(CONTRACT_ADDRESS && address) },
  });

  const { data: streak } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: dailyCheckInAbi,
    functionName: "streak",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(CONTRACT_ADDRESS && address) },
  });

  const handleCheckIn = async () => {
    if (!isConnected || !address || !CONTRACT_ADDRESS) return;

    const baseId = TARGET_CHAIN_ID;
    if (chainId !== baseId) {
      await switchChainAsync({ chainId: baseId });
    }

    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: dailyCheckInAbi,
      functionName: "checkIn",
      chainId: baseId,
    });

    await refetchCan();
  };

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <p className="font-mono text-[10px] text-white/40">
          Daily check-in: set NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS after deploy.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-terminal/30 bg-terminal/5 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-display text-[10px] font-bold tracking-widest text-terminal">
            DAILY CHECK-IN
          </p>
          {isConnected && streak !== undefined && (
            <p className="mt-0.5 font-mono text-xs text-white/60">
              Streak: {String(streak)} · Base L2 gas only
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={
            !isConnected ||
            isWriting ||
            isSwitching ||
            canCheckIn === false
          }
          onClick={handleCheckIn}
          className="shrink-0 rounded-lg border border-terminal/50 bg-terminal/10 px-3 py-2 font-display text-[10px] font-bold tracking-wider text-terminal disabled:opacity-40"
        >
          {isWriting || isSwitching
            ? "SYNCING..."
            : canCheckIn === false
              ? "DONE TODAY"
              : "CHECK IN"}
        </button>
      </div>
    </div>
  );
}
