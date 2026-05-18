import { createConfig, createStorage, cookieStorage, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";
import { Attribution } from "ox/erc8021";

const builderCode = process.env.NEXT_PUBLIC_BUILDER_CODE;
const suffixOverride = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;

function resolveDataSuffix(): `0x${string}` | undefined {
  if (suffixOverride?.startsWith("0x")) {
    return suffixOverride as `0x${string}`;
  }
  if (builderCode && builderCode !== "bc_placeholder") {
    return Attribution.toDataSuffix({ codes: [builderCode] });
  }
  return undefined;
}

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),
    baseAccount({
      appName: "Neon Hangman",
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  dataSuffix: resolveDataSuffix(),
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const TARGET_CHAIN_ID = base.id;
