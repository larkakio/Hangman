import { createConfig, createStorage, cookieStorage, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";
import { getBuilderDataSuffix } from "@/lib/builder";

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
  dataSuffix: getBuilderDataSuffix(),
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const TARGET_CHAIN_ID = base.id;
