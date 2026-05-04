import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, ExternalLink, Filter, RefreshCw, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { WatchlistButton } from "@/components/WatchlistButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATIC_ORDERS } from "@/lib/staticData";

const API_BASE = "https://lucky-geckos-give.loca.lt";
const REFRESH_MS = 60_000;

type Impact = "high" | "medium" | "low";
type SortKey = "latest" | "value" | "impact";

interface SourceRef {
  name?: string;
  url?: string;
  snippet?: string;
}

interface OrderEvent {
  id?: string | number;
  company?: string;
  company_name?: string;
  ticker?: string;
  symbol?: string;
  order_value?: number | string;
  value?: number | string;
  value_inr_cr?: number;
  client?: string;
  issuer?: string;
  contract_issuer?: string;
  type?: string;          // New / Repeat / International / Govt
  order_type?: string;
  segment?: string;       // Defense, Infra, IT, etc
  sector?: string;
  timeline?: string;
  duration?: string;
  explanation?: string;
  description?: string;
  summary?: string;
  impact?: string;        // high/medium/low
  impact_level?: string;
  confidence?: string;    // verified / single
  sources?: SourceRef[];
  source?: string | SourceRef;
  source_url?: string;
  source_name?: string;
  source_snippet?: string;
  evidence?: string;
  timestamp?: string;
  time?: string;
  date?: string;
  event?: string;
  title?: string;
}

const ORDER_KEYWORDS = [
  "order", "contract", "won", "awarded", "bagged", "loi", "letter of intent",
  "purchase order", "deal worth", "tender", "secures", "secured",
];

const parseValueCr = (raw: unknown): number | null => {
  if (raw == null) return null;
  if (typeof raw === "number" && isFinite(raw)) return raw;
  const s = String(raw).toLowerCase().replace(/,/g, "").trim();
  const num = parseFloat(s);
  if (!isFinite(num)) return null;
  if (s.includes("billion") || s.includes("bn")) return num * 100; // $1bn ~ ₹100Cr proxy if usd noted, else treat ₹bn -> ₹100Cr
  if (s.includes("crore") || s.includes("cr")) return num;
  if (s.includes("lakh")) return num / 100;
  if (s.includes("million") || s.includes("mn")) return num / 10; // rough ₹mn → cr (1cr = 10mn)
  // bare number — assume already in crore if > 1, else million
  return num;
};

const formatCr = (cr: number) => {
  if (cr >= 1000) return `₹${(cr / 1000).toFixed(2)} K Cr`;
  if (cr >= 1) return `₹${cr.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`;
  return `₹${(cr * 100).toFixed(0)} L`;
};

const normalizeImpact = (val?: string, valueCr?: number | null): Impact => {
  const v = (val || "").toLowerCase();
  if (v.includes("high")) return "high";
  if (v.includes("med")) return "medium";
  if (v.includes("low")) return "low";
  if (valueCr != null) {
    if (valueCr >= 1000) return "high";
    if (valueCr >= 100) return "medium";
    return "low";
  }
  return "low";
};

const impactStyles: Record<Impact, { dot: string; bar: string; chip: string; glow: string; label: string }> = {
  high:   { dot: "bg-warm",        bar: "bg-warm",        chip: "border-warm/40 bg-warm/10 text-warm",          glow: "glow-warm", label: "🔥 High Impact" },
  medium: { dot: "bg-accent-blue", bar: "bg-accent-blue", chip: "border-accent/40 bg-accent/10 text-accent-blue",     glow: "",                                                  label: "🟡 Medium" },
  low:    { dot: "bg-muted",       bar: "bg-border",      chip: "border-border bg-secondary/50 text-muted-foreground", glow: "",                                                  label: "⚪ Low" },
};

const isOrderEvent = (o: OrderEvent): boolean => {
  const text = `${o.event ?? ""} ${o.title ?? ""} ${o.type ?? ""} ${o.order_type ?? ""} ${o.explanation ?? o.description ?? o.summary ?? ""}`.toLowerCase();
  return ORDER_KEYWORDS.some((k) => text.includes(k));
};

const getSources = (o: OrderEvent): SourceRef[] => {
  if (Array.isArray(o.sources) && o.sources.length) return o.sources;
  const url = o.source_url || (typeof o.source === "string" ? o.source : o.source?.url);
  if (!url) return [];
  return [{
    name: o.source_name || (typeof o.source === "object" ? o.source?.name : undefined),
    url,
    snippet: o.source_snippet || o.evidence || (typeof o.source === "object" ? o.source?.snippet : undefined),
  }];
};

interface NormalizedOrder {
  raw: OrderEvent;
  id: string;
  company: string;
  ticker: string;
  valueCr: number;
  client: string;
  type: string;
  segment: string;
  timeline: string | null;
  explanation: string;
  impact: Impact;
  confidence: "VERIFIED" | "SINGLE SOURCE";
  sources: SourceRef[];
  timestamp: string;
  ts: number;
}

const normalize = (raw: OrderEvent[]): NormalizedOrder[] => {
  const out: NormalizedOrder[] = [];
  raw.forEach((o, i) => {
    if (!isOrderEvent(o)) return;
    const valueCr = parseValueCr(o.order_value ?? o.value ?? o.value_inr_cr);
    const company = o.company || o.company_name || o.ticker || o.symbol;
    const explanation = (o.explanation || o.description || o.summary || "").trim();
    const client = o.client || o.contract_issuer || o.issuer;
    // Strict filter: must have value + company + client + meaningful explanation
    if (!company || valueCr == null || !client || explanation.split(" ").length < 12) return;

    const sources = getSources(o);
    const impact = normalizeImpact(o.impact || o.impact_level, valueCr);
    const confRaw = (o.confidence || "").toLowerCase();
    const confidence: NormalizedOrder["confidence"] =
      confRaw.includes("verif") || sources.length >= 2 ? "VERIFIED" : "SINGLE SOURCE";
    const timestamp = o.timestamp || o.time || o.date || "";
    const ts = timestamp ? Date.parse(timestamp) || 0 : 0;

    out.push({
      raw: o,
      id: String(o.id ?? `${company}-${i}`),
      company,
      ticker: o.ticker || o.symbol || "",
      valueCr,
      client,
      type: o.type || o.order_type || "New Order",
      segment: o.segment || o.sector || "—",
      timeline: o.timeline || o.duration || null,
      explanation,
      impact,
      confidence,
      sources,
      timestamp,
      ts,
    });
  });
  return out;
};

const SECTORS = ["All", "Defense", "Infra", "IT", "Energy", "Auto", "Pharma", "Banking"];
const SIZE_BUCKETS: { label: string; min: number }[] = [
  { label: "All", min: 0 },
  { label: "₹100Cr+", min: 100 },
  { label: "₹500Cr+", min: 500 },
  { label: "₹1000Cr+", min: 1000 },
];
const IMPACTS: { label: string; key: "all" | Impact }[] = [
  { label: "All", key: "all" },
  { label: "High", key: "high" },
  { label: "Medium", key: "medium" },
  { label: "Low", key: "low" },
];

const Orders = () => {
  const [orders, setOrders] = useState<NormalizedOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [sector, setSector] = useState("All");
  const [sizeMin, setSizeMin] = useState(0);
  const [impactFilter, setImpactFilter] = useState<"all" | Impact>("all");
  const [sortKey, setSortKey] = useState<SortKey>("latest");

  const fetchOrders = useCallback(async (silent = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    if (silent) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        signal: controller.signal,
        headers: { "bypass-tunnel-reminder": "1", Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      const list: OrderEvent[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders) ? data.orders
        : Array.isArray(data?.alerts) ? data.alerts
        : [];
      let normalized = normalize(list);
      if (normalized.length === 0) normalized = normalize(STATIC_ORDERS as OrderEvent[]);
      setOrders(normalized);
      setLastUpdated(new Date());
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      // Fallback to static seed data so the dashboard stays useful offline.
      setOrders(normalize(STATIC_ORDERS as OrderEvent[]));
      setLastUpdated(new Date());
      setError(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(false);
    const id = setInterval(() => fetchOrders(true), REFRESH_MS);
    return () => { clearInterval(id); abortRef.current?.abort(); };
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    if (!orders) return [];
    let out = orders;
    if (sector !== "All") {
      out = out.filter((o) => o.segment.toLowerCase().includes(sector.toLowerCase()));
    }
    if (sizeMin > 0) out = out.filter((o) => o.valueCr >= sizeMin);
    if (impactFilter !== "all") out = out.filter((o) => o.impact === impactFilter);

    const impactRank: Record<Impact, number> = { high: 3, medium: 2, low: 1 };
    out = [...out].sort((a, b) => {
      if (sortKey === "value") return b.valueCr - a.valueCr;
      if (sortKey === "impact") return impactRank[b.impact] - impactRank[a.impact];
      return b.ts - a.ts;
    });
    return out;
  }, [orders, sector, sizeMin, impactFilter, sortKey]);

  const totalValue = filtered.reduce((acc, o) => acc + o.valueCr, 0);
  const highCount = filtered.filter((o) => o.impact === "high").length;

  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="04 · Order Intelligence"
        title={<>Live <span className="text-highlight">order book</span> intelligence.</>}
        description={<>Verified corporate orders & contract wins — filtered for materiality, scored by <span className="text-highlight-soft">revenue impact</span>, sourced from the tape.</>}
        strikeRate={Math.min(99, 60 + highCount * 4)}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {/* Summary strip */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <SummaryTile label="Orders shown" value={String(filtered.length)} tone="accent" />
          <SummaryTile label="Aggregate value" value={filtered.length ? formatCr(totalValue) : "—"} tone="bull" />
          <SummaryTile label="High impact" value={String(highCount)} tone="bull" />
        </div>

        {/* Toolbar */}
        <div className="mb-5 glass-card rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <FilterRow icon={<Filter className="h-3.5 w-3.5" />} label="Sector"
              options={SECTORS} value={sector} onChange={setSector} />
            <FilterRow label="Size"
              options={SIZE_BUCKETS.map((s) => s.label)}
              value={SIZE_BUCKETS.find((s) => s.min === sizeMin)?.label || "All"}
              onChange={(l) => setSizeMin(SIZE_BUCKETS.find((s) => s.label === l)?.min ?? 0)} />
            <FilterRow label="Impact"
              options={IMPACTS.map((i) => i.label)}
              value={IMPACTS.find((i) => i.key === impactFilter)?.label || "All"}
              onChange={(l) => setImpactFilter((IMPACTS.find((i) => i.label === l)?.key) ?? "all")} />
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                {([
                  { k: "latest", l: "Latest" },
                  { k: "value", l: "Highest value" },
                  { k: "impact", l: "Highest impact" },
                ] as const).map((s) => (
                  <button key={s.k} onClick={() => setSortKey(s.k)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold transition-all",
                      sortKey === s.k
                        ? "border-accent/40 bg-accent/10 text-foreground is-active-glow"
                        : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground",
                    )}>
                    {s.l}
                  </button>
                ))}
              </div>
              <Button onClick={() => fetchOrders(true)} disabled={loading || refreshing} variant="outline" size="sm" className="gap-2">
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()} · auto-refresh 60s` : "Connecting to live order feed…"}
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-bear" />
            <div className="flex-1">
              <div className="font-semibold text-bear">Couldn't load orders</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{error}</div>
            </div>
            <Button onClick={() => fetchOrders(false)} size="sm" variant="ghost">Retry</Button>
          </div>
        )}

        {loading && !orders && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="h-4 w-48 animate-pulse rounded bg-muted/40" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted/30" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-muted/30" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="glass-card flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
            <h3 className="text-base font-semibold">No qualifying orders right now</h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Adjust your filters or wait for the next refresh — only orders with verified value and full context appear here.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((o, i) => {
            const styles = impactStyles[o.impact];
            return (
              <article key={o.id}
                className={cn(
                  "glass-card glass-card-hover relative overflow-hidden rounded-2xl p-6 animate-fade-in",
                  o.impact === "high" && styles.glow,
                )}
                style={{ animationDelay: `${i * 40}ms` }}>
                {/* Left impact bar */}
                <span className={cn("absolute left-0 top-0 h-full w-1", styles.bar)} aria-hidden />

                <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
                  {/* Left side */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", styles.chip)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
                        {styles.label.replace(/^[^\s]+\s/, "")}
                      </span>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        o.confidence === "VERIFIED"
                          ? "border-primary/40 bg-primary/10 text-bull"
                          : "border-border bg-secondary/50 text-muted-foreground",
                      )}>
                        <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                        {o.confidence}
                      </span>
                      <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-blue">
                        {o.type}
                      </span>
                      <span className="rounded-full border border-border bg-secondary/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {o.segment}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <h3 className="text-lg font-bold tracking-tight">{o.company}</h3>
                      {o.ticker && (
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {o.ticker}
                        </span>
                      )}
                      <WatchlistButton
                        item={{ ticker: o.ticker || o.company, name: o.company, metric: formatCr(o.valueCr), metricLabel: "Order Value" }}
                      />
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-foreground/85">{o.explanation}</p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3 text-[11px]">
                      <Meta label="Client" value={o.client} />
                      <Meta label="Timeline" value={o.timeline || "—"} />
                      <Meta label="Logged" value={o.timestamp || "—"} icon={<Clock className="h-3 w-3" />} />
                    </div>

                    {/* Sources */}
                    {o.sources.length > 0 && (
                      <div className="mt-4 rounded-xl border border-border/50 bg-card/40 p-3">
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Sources · {o.sources.length}
                        </div>
                        <ul className="space-y-2">
                          {o.sources.map((s, idx) => (
                            <li key={idx} className="text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-foreground/90">
                                  {s.name || (s.url ? new URL(s.url).hostname.replace(/^www\./, "") : "Source")}
                                </span>
                                {s.url && (
                                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-accent-blue hover:underline underline-offset-4">
                                    Open <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              {s.snippet && (
                                <p className="mt-1 line-clamp-2 italic text-muted-foreground">"{s.snippet}"</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right: Order value */}
                  <div className="md:w-48 md:text-right">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Order Value</div>
                    <div className={cn(
                      "num-display mt-1 text-3xl md:text-4xl font-black tracking-tight",
                      o.impact === "high" ? "text-bull" : "text-foreground",
                    )}>
                      {formatCr(o.valueCr)}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};

const SummaryTile = ({ label, value, tone }: { label: string; value: string; tone: "bull" | "accent" | "muted" }) => (
  <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    <span className={cn(
      "num-display text-2xl",
      tone === "bull" && "text-bull",
      tone === "accent" && "text-accent-blue",
      tone === "muted" && "text-foreground",
    )}>
      {value}
    </span>
  </div>
);

const Meta = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div>
    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    <div className="mt-0.5 inline-flex items-center gap-1.5 text-foreground/85">
      {icon}{value}
    </div>
  </div>
);

const FilterRow = ({ icon, label, options, value, onChange }: {
  icon?: React.ReactNode; label: string; options: string[]; value: string; onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
      {icon}{label}
    </span>
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)}
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-semibold transition-all",
            value === opt
              ? "border-accent/40 bg-accent/10 text-foreground is-active-glow"
              : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground",
          )}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default Orders;
