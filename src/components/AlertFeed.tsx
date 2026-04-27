import { useEffect, useState } from "react";
import { Activity, ArrowDown, ArrowUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: number;
  ticker: string;
  message: string;
  signal: "bullish" | "bearish" | "neutral";
  time: string;
}

const seed: Alert[] = [
  { id: 1, ticker: "INFY", message: "Strike triggered — Insider buying detected", signal: "bullish", time: "2m ago" },
  { id: 2, ticker: "TATAMOTORS", message: "Earnings beat — 12% revenue surprise", signal: "bullish", time: "8m ago" },
  { id: 3, ticker: "ADANIPORTS", message: "Bearish reversal — heavy block sell", signal: "bearish", time: "14m ago" },
  { id: 4, ticker: "HDFCBANK", message: "Sentiment shift — analyst upgrades stack", signal: "bullish", time: "22m ago" },
  { id: 5, ticker: "RELIANCE", message: "Volume spike +180% above 20D avg", signal: "neutral", time: "31m ago" },
  { id: 6, ticker: "SUNPHARMA", message: "FDA approval — bullish breakout setup", signal: "bullish", time: "44m ago" },
];

export const AlertFeed = () => {
  const [alerts, setAlerts] = useState<Alert[]>(seed);

  useEffect(() => {
    const id = setInterval(() => {
      setAlerts((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push({ ...first, id: Date.now(), time: "now" });
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15">
            <Zap className="h-3.5 w-3.5 text-accent-blue" />
          </div>
          <h3 className="text-base font-bold">Live Strike Feed</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live
        </div>
      </div>

      <div className="space-y-2.5 max-h-[480px] overflow-hidden">
        {alerts.map((a, i) => {
          const Icon = a.signal === "bullish" ? ArrowUp : a.signal === "bearish" ? ArrowDown : Activity;
          return (
            <div
              key={a.id}
              className={cn(
                "group flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3 transition-all hover:border-accent/40 hover:bg-secondary/60 animate-slide-in-right",
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  a.signal === "bullish" && "bg-primary/15 text-bull",
                  a.signal === "bearish" && "bg-destructive/15 text-bear",
                  a.signal === "neutral" && "bg-accent/15 text-accent-blue",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-bold tracking-wide">{a.ticker}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{a.time}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{a.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
