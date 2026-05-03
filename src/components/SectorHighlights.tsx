import { useEffect, useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE } from "@/lib/resultsApi";

interface Bucket { sector: string; high: number; total: number; }

interface Props {
  // Map of sector -> { high, total } from the currently filtered Results data
  resultsBuckets: Bucket[];
}

// Pulls /orders once and cross-references with current results buckets to
// surface the sectors with the most high-impact activity in either feed.
export const SectorHighlights = ({ resultsBuckets }: Props) => {
  const [orderBuckets, setOrderBuckets] = useState<Bucket[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/orders`, { headers: { "bypass-tunnel-reminder": "1", Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (cancelled) return;
        const list: any[] = Array.isArray(data) ? data : data?.orders ?? data?.alerts ?? [];
        const map = new Map<string, Bucket>();
        list.forEach((o) => {
          const s = (o.segment || o.sector || "Other").toString();
          const impact = (o.impact || o.impact_level || "").toLowerCase();
          const valueCr = parseFloat(String(o.order_value ?? o.value ?? o.value_inr_cr ?? 0));
          const isHigh = impact.includes("high") || valueCr >= 1000;
          const cur = map.get(s) || { sector: s, high: 0, total: 0 };
          cur.total += 1;
          if (isHigh) cur.high += 1;
          map.set(s, cur);
        });
        setOrderBuckets([...map.values()]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const merged = useMemo(() => {
    const map = new Map<string, { sector: string; resultsHigh: number; ordersHigh: number; total: number }>();
    resultsBuckets.forEach((b) => {
      map.set(b.sector, { sector: b.sector, resultsHigh: b.high, ordersHigh: 0, total: b.total });
    });
    orderBuckets.forEach((b) => {
      const cur = map.get(b.sector) || { sector: b.sector, resultsHigh: 0, ordersHigh: 0, total: 0 };
      cur.ordersHigh = b.high;
      cur.total += b.total;
      map.set(b.sector, cur);
    });
    return [...map.values()]
      .map((m) => ({ ...m, score: m.resultsHigh * 2 + m.ordersHigh * 2 + m.total }))
      .filter((m) => m.score > 0 && m.sector !== "—" && m.sector !== "Other")
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [resultsBuckets, orderBuckets]);

  if (!merged.length) return null;

  const max = Math.max(...merged.map((m) => m.score));

  return (
    <div className="mb-6 glass-card rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-3.5 w-3.5 text-accent-blue" />
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          Sector Highlights · high-impact orders & results
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {merged.map((m) => {
          const pct = Math.round((m.score / max) * 100);
          return (
            <div key={m.sector} className="rounded-xl border border-border/50 bg-secondary/30 p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold tracking-tight">{m.sector}</span>
                <span className="num-display text-base text-accent-blue">{m.resultsHigh + m.ordersHigh}</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/40">
                <div className={cn("h-full rounded-full bg-gradient-to-r from-accent to-primary")} style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>{m.resultsHigh} results</span>
                <span>{m.ordersHigh} orders</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
