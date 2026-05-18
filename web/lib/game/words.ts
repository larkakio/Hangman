export const WORD_POOLS: Record<string, string[]> = {
  easy: [
    "CYBER",
    "NODE",
    "WIFI",
    "HACK",
    "BYTE",
    "CODE",
    "GRID",
    "FLUX",
    "NEON",
    "SYNC",
    "DATA",
    "CORE",
    "LINK",
    "CHIP",
    "PORT",
  ],
  medium: [
    "MATRIX",
    "ROUTER",
    "SOCKET",
    "KERNEL",
    "CIPHER",
    "BINARY",
    "SERVER",
    "WALLET",
    "ORACLE",
    "BRIDGE",
    "SIGNAL",
    "VECTOR",
    "PHOTON",
    "QUANTUM",
    "STAKING",
  ],
  hard: [
    "BLOCKCHAIN",
    "ENCRYPTION",
    "ALGORITHM",
    "FIREWALL",
    "PROTOCOL",
    "TERMINAL",
    "HARDWARE",
    "SOFTWARE",
    "MAINFRAME",
    "SATELLITE",
    "BIOMETRIC",
    "HYPERLOOP",
  ],
  expert: [
    "CRYPTOCURRENCY",
    "AUTHENTICATION",
    "DECENTRALIZED",
    "INFRASTRUCTURE",
    "MICROPROCESSOR",
    "NANOTECHNOLOGY",
    "TELECOMMUNICATION",
  ],
};

export function getLevelConfig(level: number): {
  pool: string[];
  maxWrong: number;
} {
  if (level <= 3) {
    return { pool: WORD_POOLS.easy, maxWrong: 8 };
  }
  if (level <= 6) {
    return { pool: WORD_POOLS.medium, maxWrong: 7 };
  }
  if (level <= 10) {
    return { pool: WORD_POOLS.hard, maxWrong: 6 };
  }
  return { pool: WORD_POOLS.expert, maxWrong: 5 };
}

export function pickWordForLevel(level: number, usedWords: string[]): string {
  const { pool } = getLevelConfig(level);
  const available = pool.filter((w) => !usedWords.includes(w));
  const source = available.length > 0 ? available : pool;
  const index = (level * 7 + usedWords.length * 3) % source.length;
  return source[index] ?? source[0]!;
}
