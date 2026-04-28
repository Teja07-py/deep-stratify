// Maps sector names to representative emoji/icon symbols.
// Keys are normalized to UPPERCASE.
const SECTOR_SYMBOLS = {
  BANKING: "🏦",
  BANK: "🏦",
  FINANCE: "💳",
  FINANCIAL: "💳",
  IT: "💻",
  TECH: "💻",
  TECHNOLOGY: "💻",
  FMCG: "🛒",
  CONSUMER: "🛍️",
  PHARMA: "💊",
  PHARMACEUTICAL: "💊",
  HEALTHCARE: "🩺",
  AUTO: "🚗",
  AUTOMOBILE: "🚗",
  ENERGY: "⛽",
  OIL: "🛢️",
  METALS: "⛏️",
  MINING: "⛏️",
  REALTY: "🏗️",
  REAL_ESTATE: "🏗️",
  TELECOM: "📡",
  INFRA: "🏛️",
  INFRASTRUCTURE: "🏛️",
  MEDIA: "🎬",
  PSU: "🏛️",
  CHEMICALS: "⚗️",
  CEMENT: "🧱",
  TEXTILES: "🧵",
  AGRI: "🌾",
  RETAIL: "🛍️",
  AVIATION: "✈️",
  LOGISTICS: "📦",
  DEFENSE: "🛡️",
  POWER: "⚡",
  RENEWABLES: "🌱",
};

const FALLBACK = "📈";

export const normalizeSector = (name = "") =>
  String(name).trim().toUpperCase().replace(/\s+/g, "_");

export const getSectorSymbol = (name) => {
  const key = normalizeSector(name);
  return SECTOR_SYMBOLS[key] || FALLBACK;
};

export default SECTOR_SYMBOLS;
