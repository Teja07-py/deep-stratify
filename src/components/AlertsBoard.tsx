import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const API_BASE = "https://lucky-geckos-give.loca.lt";
const REFRESH_MS = 30_000;

type Impact = "bullish" | "bearish" | "neutral";

interface Alert {
  id?: string | number;
  company?: string;
  company_name?: string;
  ticker?: string;
  event?: string;
  title?: string;
  summary?: string;
  description?: string;
  impact?: string;
  sentiment?: string;
  source?: string;
  source_url?: string;
  url?: string;
  link?: string;
  source_name?: string;
  timestamp?: string;
  time?: string;
}

const normalizeImpact = (val?: string): Impact => {
  const v = (val || "").toLowerCase();
  if (["bull", "bullish", "positive", "up", "buy"].some((k) => v.includes(k))) return "bullish";
  if (["bear", "bearish", "negative", "down", "sell"].some((k) => v.includes(k))) return "bearish";
  return "neutral";
};

const impactStyles: Record<Impact, { chip: string; border: string; icon: typeof TrendingUp; label: string }> = {
  bullish: {
    chip: "border-primary/40 bg-primary/10 text-bull",
    border: "border-l-primary/70",
    icon: TrendingUp,
    label: "BULLISH",
  },
  bearish: {
    chip: "border-destructive/40 bg-destructive/10 text-bear",
    border: "border-l-destructive/70",
    icon: TrendingDown,
    label: "BEARISH",
  },
  neutral: {
    chip: "border-border bg-secondary/50 text-muted-foreground",
    border: "border-l-border",
    icon: Minus,
    label: "NEUTRAL",
  },
};

const clampSummary = (text: string) => {
  const sentences = text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 5).join(" ");
};

export const AlertsBoard = () => {
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchAlerts = useCallback(async (silent = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/alerts`, {
        signal: controller.signal,
        headers: { "bypass-tunnel-reminder": "1", Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      const list: Alert[] = Array.isArray(data) ? data : Array.isArray(data?.alerts) ? data.alerts : [];
      setAlerts(list);
      setLastUpdated(new Date());
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message || "Failed to load alerts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts(false);
    const id = setInterval(() => fetchAlerts(true), REFRESH_MS);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [fetchAlerts]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Market Alerts</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()} · auto-refresh 30s`
              : "Connecting to live feed…"}
          </p>
        </div>
        <Button
          onClick={() => fetchAlerts(true)}
          disabled={loading || refreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-bear" />
          <div className="flex-1">
            <div className="font-semibold text-bear">Couldn't load alerts</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{error}</div>
          </div>
          <Button onClick={() => fetchAlerts(false)} size="sm" variant="ghost">
            Retry
          </Button>
        </div>
      )}

      {loading && !alerts && (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="h-4 w-32 animate-pulse rounded bg-muted/40" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted/30" />
              <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-muted/30" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-muted/30" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && alerts && alerts.length === 0 && (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60">
            <Minus className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-semibold">No important alerts right now</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            We're watching the tape. New high-conviction events will appear here automatically.
          </p>
        </div>
      )}

      {alerts && alerts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {alerts.map((a, i) => {
            const company = a.company || a.company_name || a.ticker || "Unknown";
            const event = a.event || a.title || "Market event";
            const summary = clampSummary(a.summary || a.description || "");
            const impact = normalizeImpact(a.impact || a.sentiment);
            const src = a.source_url || a.url || a.link || a.source;
            const srcLabel = a.source_name || (src ? new URL(src).hostname.replace(/^www\./, "") : null);
            const styles = impactStyles[impact];
            const Icon = styles.icon;

            return (
              <article
                key={a.id ?? `${company}-${i}`}
                className={cn(
                  "glass-card group flex flex-col rounded-2xl border-l-4 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
                  styles.border,
                )}
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {a.ticker && a.ticker !== company ? a.ticker : "Company"}
                    </div>
                    <h3 className="mt-0.5 truncate text-base font-bold">{company}</h3>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      styles.chip,
                    )}
                  >
                    <Icon className="h-3 w-3" strokeWidth={2.5} />
                    {styles.label}
                  </span>
                </header>

                <p className="mt-3 text-sm font-semibold text-foreground/90">{event}</p>

                {summary && (
                  <p className="mt-2 line-clamp-5 text-sm leading-relaxed text-muted-foreground">{summary}</p>
                )}

                <footer className="mt-4 flex items-center justify-between gap-3 border-t border-border/40 pt-3">
                  <span className="text-[11px] text-muted-foreground">
                    {a.timestamp || a.time || ""}
                  </span>
                  {src ? (
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-blue hover:underline underline-offset-4"
                    >
                      {srcLabel || "Source"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No source</span>
                  )}
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
