// Shared utilities & types for the Results dashboard (API-driven).
export const API_BASE = "https://lucky-geckos-give.loca.lt";
export const REFRESH_MS = 60_000;

export type Sentiment = "strong" | "neutral" | "weak";

export interface RawResult {
  id?: string | number;
  ticker?: string;
  symbol?: string;
  company?: string;
  company_name?: string;
  name?: string;
  sector?: string;
  segment?: string;
  quarter?: string;
  period?: string;
  rating?: string;
  sentiment?: string;
  result?: string;
  highlight?: string;
  summary?: string;
  ai_summary?: string;
  description?: string;

  // Growth %
  revenue_yoy?: number | string;
  sales_yoy?: number | string;
  pat_yoy?: number | string;
  profit_yoy?: number | string;
  eps_yoy?: number | string;

  // Detail metrics
  sales?: { current?: number; previous?: number; year_ago?: number; yoy?: number; qoq?: number };
  operating_profit?: { current?: number; previous?: number; year_ago?: number; yoy?: number; qoq?: number };
  opm?: { current?: number; previous?: number; year_ago?: number; yoy?: number; qoq?: number };
  pat?: { current?: number; previous?: number; year_ago?: number; yoy?: number; qoq?: number };
  eps?: { current?: number; previous?: number; year_ago?: number; yoy?: number; qoq?: number };

  metrics?: Record<string, { current?: number; previous?: number; year_ago?: number; yoy?: number; qoq?: number }>;

  ai_analysis?: string;
  insights?: string[] | string;
  key_insights?: string[] | string;

  cmp?: number | string;
  market_cap?: number | string;
  pe?: number | string;
  pe_ratio?: number | string;

  timestamp?: string;
  date?: string;
}

export const num = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[,%₹\s]/g, ""));
  return isFinite(n) ? n : null;
};

export const normalizeSentiment = (raw?: string, scoreHints?: number[]): Sentiment => {
  const v = (raw || "").toLowerCase();
  if (v.includes("strong") || v.includes("excellent") || v.includes("beat") || v.includes("bull") || v.includes("positive")) return "strong";
  if (v.includes("weak") || v.includes("miss") || v.includes("bear") || v.includes("negative") || v.includes("poor")) return "weak";
  if (v.includes("neutral") || v.includes("inline") || v.includes("average") || v.includes("mixed")) return "neutral";
  // Fallback from numeric hints
  if (scoreHints?.length) {
    const avg = scoreHints.reduce((a, b) => a + b, 0) / scoreHints.length;
    if (avg >= 12) return "strong";
    if (avg <= -2) return "weak";
    return "neutral";
  }
  return "neutral";
};

export interface NormalizedResult {
  raw: RawResult;
  id: string;
  ticker: string;
  company: string;
  sector: string;
  quarter: string;
  rating: string;
  sentiment: Sentiment;
  highlight: string;
  revenueYoY: number | null;
  patYoY: number | null;
  epsYoY: number | null;
  growthScore: number;
  ts: number;
}

export const normalizeResults = (raw: RawResult[]): NormalizedResult[] => {
  return raw.map((r, i) => {
    const company = r.company || r.company_name || r.name || r.ticker || r.symbol || "—";
    const ticker = (r.ticker || r.symbol || "").toUpperCase();
    const revenueYoY = num(r.revenue_yoy ?? r.sales_yoy ?? r.sales?.yoy);
    const patYoY = num(r.pat_yoy ?? r.profit_yoy ?? r.pat?.yoy);
    const epsYoY = num(r.eps_yoy ?? r.eps?.yoy);
    const hints = [revenueYoY, patYoY, epsYoY].filter((x): x is number => x != null);
    const sentiment = normalizeSentiment(r.sentiment || r.result || r.rating, hints);
    const ts = r.timestamp || r.date ? Date.parse(r.timestamp || r.date || "") || 0 : 0;
    const highlight = (r.highlight || r.ai_summary || r.summary || r.description || "").trim();
    return {
      raw: r,
      id: String(r.id ?? ticker ?? `${company}-${i}`),
      ticker: ticker || company.slice(0, 6).toUpperCase(),
      company,
      sector: r.sector || r.segment || "—",
      quarter: r.quarter || r.period || "Latest Quarter",
      rating: r.rating || (sentiment === "strong" ? "Excellent" : sentiment === "weak" ? "Weak" : "Average"),
      sentiment,
      highlight,
      revenueYoY,
      patYoY,
      epsYoY,
      growthScore: hints.length ? hints.reduce((a, b) => a + b, 0) / hints.length : -Infinity,
      ts,
    };
  });
};

export async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    signal,
    headers: { "bypass-tunnel-reminder": "1", Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export const sentimentStyles: Record<Sentiment, { chip: string; bar: string; dot: string; text: string; label: string; glow: string }> = {
  strong:  { chip: "border-warm/40 bg-warm/10 text-warm", bar: "bg-warm", dot: "bg-warm", text: "text-warm", label: "Strong",  glow: "glow-warm" },
  neutral: { chip: "border-accent/30 bg-accent/10 text-accent-blue",     bar: "bg-accent-blue", dot: "bg-accent-blue", text: "text-accent-blue", label: "Neutral", glow: "" },
  weak:    { chip: "border-destructive/40 bg-destructive/10 text-bear",  bar: "bg-bear",        dot: "bg-bear",        text: "text-bear",        label: "Weak",    glow: "" },
};

export const fmtPct = (v: number | null) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`);
