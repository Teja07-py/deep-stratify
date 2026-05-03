import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  fetchJson, normalizeResults, sentimentStyles, num, fmtPct,
  type RawResult, type NormalizedResult,
} from "@/lib/resultsApi";

type MetricRow = {
  label: string;
  current: number | null;
  previous: number | null;
  yearAgo: number | null;
  qoq: number | null;
  yoy: number | null;
  unit?: string;
  isPct?: boolean;
};

const computePct = (curr: number | null, prev: number | null): number | null => {
  if (curr == null || prev == null || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev)) * 100;
};

const buildRows = (raw: RawResult): MetricRow[] => {
  const fromBlock = (
    label: string,
    block: RawResult["sales"] | undefined,
    isPct = false,
    unit?: string,
  ): MetricRow => {
    const current = num(block?.current);
    const previous = num(block?.previous);
    const yearAgo = num(block?.year_ago);
    const yoy = num(block?.yoy) ?? computePct(current, yearAgo);
    const qoq = num(block?.qoq) ?? computePct(current, previous);
    return { label, current, previous, yearAgo, qoq, yoy, unit, isPct };
  };
  const rows: MetricRow[] = [
    fromBlock("Sales", raw.sales, false, "₹ Cr"),
    fromBlock("Operating Profit", raw.operating_profit, false, "₹ Cr"),
    fromBlock("OPM", raw.opm, true),
    fromBlock("PAT", raw.pat, false, "₹ Cr"),
    fromBlock("EPS", raw.eps, false, "₹"),
  ];
  // Fill blanks from generic metrics map if present.
  if (raw.metrics) {
    rows.forEach((r) => {
      const key = r.label.toLowerCase().replace(/\s+/g, "_");
      const m = raw.metrics?.[key] || raw.metrics?.[r.label];
      if (!m) return;
      r.current = r.current ?? num(m.current);
      r.previous = r.previous ?? num(m.previous);
      r.yearAgo = r.yearAgo ?? num(m.year_ago);
      r.yoy = r.yoy ?? num(m.yoy) ?? computePct(r.current, r.yearAgo);
      r.qoq = r.qoq ?? num(m.qoq) ?? computePct(r.current, r.previous);
    });
  }
  return rows;
};

const fmtNum = (v: number | null, isPct?: boolean) => {
  if (v == null) return "—";
  if (isPct) return `${v.toFixed(1)}%`;
  return v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const ResultDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const seeded = (location.state as { result?: RawResult } | null)?.result || null;

  const [raw, setRaw] = useState<RawResult | null>(seeded);
  const [loading, setLoading] = useState(!seeded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (raw) return;
    const controller = new AbortController();
    setLoading(true);
    fetchJson<unknown>("/results", controller.signal)
      .then((json) => {
        const list: RawResult[] = Array.isArray(json) ? (json as RawResult[]) : (json as any)?.results ?? [];
        const normalized = normalizeResults(list);
        const match = normalized.find((n) => n.id === id) || normalized.find((n) => n.ticker === id);
        if (!match) throw new Error("Result not found");
        setRaw(match.raw);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setError((err as Error).message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id, raw]);

  const normalized: NormalizedResult | null = useMemo(
    () => (raw ? normalizeResults([raw])[0] : null),
    [raw],
  );

  const rows = useMemo(() => (raw ? buildRows(raw) : []), [raw]);

  if (loading && !raw) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-6 py-12 space-y-4">
          <div className="h-8 w-64 animate-pulse rounded bg-muted/40" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-muted/30" />
        </div>
      </PageShell>
    );
  }

  if (error || !raw || !normalized) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-bear" />
            <div className="flex-1">
              <div className="font-semibold text-bear">Couldn't load result</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{error ?? "Not found"}</div>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
            <Link to="/results"><ArrowLeft className="h-4 w-4" /> Back to results</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const styles = sentimentStyles[normalized.sentiment];
  const insightsRaw = raw.key_insights ?? raw.insights;
  const insights: string[] = Array.isArray(insightsRaw)
    ? insightsRaw
    : typeof insightsRaw === "string"
      ? insightsRaw.split(/\n|•|;/).map((s) => s.trim()).filter(Boolean)
      : [];
  const aiAnalysis = (raw.ai_analysis || raw.ai_summary || raw.summary || normalized.highlight || "").trim();
  const cmp = num(raw.cmp);
  const mcap = raw.market_cap;
  const pe = num(raw.pe ?? raw.pe_ratio);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-12">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/results"><ArrowLeft className="h-4 w-4" /> Back to results</Link>
        </Button>

        {/* Header */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <span className={cn("absolute left-0 top-0 h-full w-1", styles.bar)} aria-hidden />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {normalized.ticker} · {normalized.sector}
              </div>
              <h1 className="mt-2 font-display text-4xl font-black tracking-tight">{normalized.company}</h1>
              <div className="mt-1 text-sm text-muted-foreground">{normalized.quarter}</div>
            </div>
            <span className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
              styles.chip,
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
              {normalized.rating}
            </span>
          </div>

          {/* Top stats */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Revenue YoY" value={fmtPct(normalized.revenueYoY)} tone={normalized.revenueYoY} />
            <Stat label="PAT YoY" value={fmtPct(normalized.patYoY)} tone={normalized.patYoY} />
            <Stat label="EPS YoY" value={fmtPct(normalized.epsYoY)} tone={normalized.epsYoY} />
          </div>
        </div>

        {/* Metrics table */}
        <div className="mt-6 glass-card rounded-2xl p-6">
          <h2 className="text-base font-bold tracking-tight">Quarterly Performance</h2>
          <p className="mt-1 text-xs text-muted-foreground">Standalone numbers · {normalized.quarter}</p>

          <div className="mt-4 overflow-hidden rounded-xl border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40">
                  <TableHead className="w-[200px]">Metric</TableHead>
                  <TableHead className="text-right">QoQ</TableHead>
                  <TableHead className="text-right">YoY</TableHead>
                  <TableHead className="text-right">Current Quarter</TableHead>
                  <TableHead className="text-right">Previous Quarter</TableHead>
                  <TableHead className="text-right">Year Ago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.label}>
                    <TableCell className="font-semibold">{r.label}{r.unit && <span className="ml-1 text-[10px] font-normal text-muted-foreground">{r.unit}</span>}</TableCell>
                    <TableCell className="text-right tabular-nums"><Delta value={r.qoq} /></TableCell>
                    <TableCell className="text-right tabular-nums"><Delta value={r.yoy} /></TableCell>
                    <TableCell className="text-right tabular-nums font-bold">{fmtNum(r.current, r.isPct)}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{fmtNum(r.previous, r.isPct)}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{fmtNum(r.yearAgo, r.isPct)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* AI analysis */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-bold tracking-tight">AI Analysis</h2>
            {aiAnalysis ? (
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{aiAnalysis}</p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Awaiting management commentary.</p>
            )}

            {insights.length > 0 && (
              <div className="mt-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Key insights</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {insights.slice(0, 6).map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-accent-blue shrink-0" />
                      <span className="text-foreground/85">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Valuation */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-bold tracking-tight">Valuation</h2>
            <div className="mt-4 space-y-3">
              <ValRow label="CMP" value={cmp != null ? `₹${cmp.toLocaleString("en-IN")}` : "—"} />
              <ValRow label="Market Cap" value={mcap ? String(mcap) : "—"} />
              <ValRow label="P/E" value={pe != null ? pe.toFixed(2) : "—"} />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

const Stat = ({ label, value, tone }: { label: string; value: string; tone: number | null }) => {
  const t = tone == null ? "text-foreground" : tone >= 0 ? "text-bull" : "text-bear";
  return (
    <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className={cn("num-display mt-1 text-2xl", t)}>{value}</div>
    </div>
  );
};

const Delta = ({ value }: { value: number | null }) => {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  const tone = value >= 0 ? "text-bull" : "text-bear";
  return <span className={cn("font-semibold", tone)}>{value >= 0 ? "+" : ""}{value.toFixed(1)}%</span>;
};

const ValRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between border-b border-border/30 pb-2 last:border-0">
    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
    <span className="num-display text-base text-foreground">{value}</span>
  </div>
);

export default ResultDetail;
