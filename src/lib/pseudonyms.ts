const adjectives = [
  "Blue",
  "Quiet",
  "Steady",
  "Gentle",
  "Amber",
  "Silver",
  "Open",
  "Brave",
  "Calm",
  "Kind",
] as const;

const bunnyNames = [
  "Bunny",
  "Hopper",
  "Thumper",
  "Cottontail",
  "Moonbun",
  "Meadowbun",
  "Softpaw",
  "Velvetbun",
  "Burrower",
  "Dandelion",
] as const;

const accentColors = [
  "#C75C2A",
  "#2F7F71",
  "#6476C8",
  "#B8547F",
  "#DAA33B",
  "#6B8E4E",
] as const;

function hashSeed(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function generateWeeklyPseudonym(seed: string) {
  const hash = hashSeed(seed);
  const adjective = adjectives[hash % adjectives.length];
  const bunnyName = bunnyNames[Math.floor(hash / 7) % bunnyNames.length];
  const accentColor = accentColors[Math.floor(hash / 13) % accentColors.length];

  return {
    pseudonym: `${adjective} ${bunnyName}`,
    accentColor,
  };
}
