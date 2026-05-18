import { Attribution } from "ox/erc8021";

/** From base.dev → Settings → Builder Codes */
export const BUILDER_CODE =
  process.env.NEXT_PUBLIC_BUILDER_CODE ?? "bc_fg7qhzxz";

/**
 * ERC-8021 calldata suffix for all wagmi transactions (config `dataSuffix`).
 * @see https://docs.base.org/apps/builder-codes/app-developers
 */
export function getBuilderDataSuffix(): `0x${string}` | undefined {
  const override = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;
  if (override?.startsWith("0x")) {
    return override as `0x${string}`;
  }
  if (!BUILDER_CODE || BUILDER_CODE === "bc_placeholder") {
    return undefined;
  }
  return Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
}
