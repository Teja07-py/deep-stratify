import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, ArrowUpRight, Filter, RefreshCw, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { WatchlistButton } from "@/components/WatchlistButton";
import { SectorHighlights } from "@/components/SectorHighlights";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  REFRESH_MS, fetchJson, normalizeResults, sentimentStyles, fmtPct,
  type RawResult, type NormalizedResult, type Sentiment,
} from "@/lib/resultsApi";
import { STATIC_RESULTS } from "@/lib/staticData";

type SentFilter = "all" | Sentiment;
type SortKey = "latest" | "growth";

const Results = () => {
  const [data, setData] = useState<NormalizedResult[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [sentFilter, setSentFilter] = useState<SentFilter>("all");
  const [sector, setSector] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("latest");

  const load = useCallback(async (silent = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    if (silent) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const json = await fetchJson<unknown>("/results", controller.signal);
      const list: RawResult[] = Array.isArray(json)
        ? (json as RawResult[])
        : Array.isArray((json as any)?.results) ? (json as any).results
        : [];
      const normalized = normalizeResults(list);
      setData(normalized.length ? normalized : normalizeResults(STATIC_RESULTS));
      setLastUpdated(new Date());
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      // Fallback to static seed data so the dashboard remains usable.
      setData(normalizeResults(STATIC_RESULTS));
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
    const id = setInterval(() => load(true), REFRESH_MS);
    return () => { clearInterval(id); abortRef.current?.abort(); };
  }, [load]);

  const sectors = useMemo(() => {
    const s = new Set<string>(["All"]);
    data?.forEach((r) => r.sector && r.sector !== "—" && s.add(r.sector));
    return [...s];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let out = data;
    if (sentFilter !== "all") out = out.filter((r) => r.sentiment === sentFilter);
    if (sector !== "All") out = out.filter((r) => r.sector === sector);
    out = [...out].sort((a, b) => sortKey === "growth" ? b.growthScore - a.growthScore : b.ts - a.ts);
    return out;
  }, [data, sentFilter, sector, sortKey]);

  // Aggregate filtered results into sector buckets for the highlights panel.
  const resultsBuckets = useMemo(() => {
    const map = new Map<string, { sector: string; high: number; total: number }>();
    filtered.forEach((r) => {
      const cur = map.get(r.sector) || { sector: r.sector, high: 0, total: 0 };
      cur.total += 1;
      if (r.sentiment === "strong") cur.high += 1;
      map.set(r.sector, cur);
    });
    return [...map.values()];
  }, [filtered]);

  const strongCount = filtered.filter((r) => r.sentiment === "strong").length;

  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="01 · Earnings Intelligence"
        title={<>This quarter's <span className="text-highlight">earnings, decoded</span>.</>}
        description={<>Live results feed — filtered for materiality, scored by <span className="text-highlight-soft">growth quality</span>, ranked by sentiment.</>}
        strikeRate={Math.min(99, 55 + strongCount * 4)}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <SectorHighlights resultsBuckets={resultsBuckets} />

        {/* Toolbar */}
        <div className="mb-5 glass-card rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <FilterRow icon={<Filter className="h-3.5 w-3.5" />} label="Sentiment"
              options={["All", "Strong", "Neutral", "Weak"]}
              value={sentFilter === "all" ? "All" : sentFilter[0].toUpperCase() + sentFilter.slice(1)}
              onChange={(l) => setSentFilter(l === "All" ? "all" : (l.toLowerCase() as Sentiment))} />
            <FilterRow label="Sector" options={sectors} value={sector} onChange={setSector} />
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                {([{ k: "latest", l: "Latest" }, { k: "growth", l: "Highest Growth" }] as const).map((s) => (
                  <button key={s.k} onClick={() => setSortKey(s.k)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold transition-all",
                      sortKey === s.k
                        ? "border-accent/40 bg-accent/10 text-foreground is-active-glow"
                        : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground",
                    )}>{s.l}</button>
                ))}
              </div>
              <Button onClick={() => load(true)} disabled={loading || refreshing} variant="outline" size="sm" className="gap-2">
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()} · auto-refresh 60s` : "Connecting to live results feed…"}
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-bear" />
            <div className="flex-1">
              <div className="font-semibold text-bear">Couldn't load results</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{error}</div>
            </div>
            <Button onClick={() => load(false)} size="sm" variant="ghost">Retry</Button>
          </div>
        )}

        {loading && !data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <div className="h-4 w-32 animate-pulse rounded bg-muted/40" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted/30" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-muted/30" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="glass-card flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
            <h3 className="text-base font-semibold">No qualifying results right now</h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Adjust your filters or wait for the next refresh.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => {
            const styles = sentimentStyles[r.sentiment];
            return (
              <Link key={r.id} to={`/results/${encodeURIComponent(r.id)}`}
                state={{ result: r.raw }}
                className={cn(
                  "group glass-card glass-card-hover relative block overflow-hidden rounded-2xl p-5 animate-fade-in",
                  r.sentiment === "strong" && styles.glow,
                )}
                style={{ animationDelay: `${i * 40}ms` }}>
                <span className={cn("absolute left-0 top-0 h-full w-1", styles.bar)} aria-hidden />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-bold tracking-tight">{r.company}</h3>
                      <WatchlistButton item={{ ticker: r.ticker, name: r.company, metric: fmtPct(r.patYoY), metricLabel: "PAT YoY" }} />
                    </div>
                    <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {r.ticker} · {r.sector}
                    </div>
                  </div>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    styles.chip,
                  )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
                    {styles.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Metric label="Revenue" value={r.revenueYoY} />
                  <Metric label="PAT" value={r.patYoY} />
                  <Metric label="EPS" value={r.epsYoY} />
                </div>

                {r.highlight && (
                  <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-foreground/80">
                    {r.highlight}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{r.quarter}</span>
                  <span className="inline-flex items-center gap-1 text-accent-blue group-hover:translate-x-0.5 transition-transform">
                    View details <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};

const Metric = ({ label, value }: { label: string; value: number | null }) => {
  const tone = value == null ? "text-muted-foreground" : value >= 0 ? "text-bull" : "text-bear";
  return (
    <div className="rounded-lg border border-border/40 bg-secondary/20 px-2 py-2">
      <div className={cn("num-display text-base", tone)}>{fmtPct(value)}</div>
      <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label} YoY</div>
    </div>
  );
};

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
          )}>{opt}</button>
      ))}
    </div>
  </div>
);

export default Results;
