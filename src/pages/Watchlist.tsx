import { Star, Trash2, Bell, TrendingUp, TrendingDown } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";

const Watchlist = () => {
  const { items, remove } = useWatchlist();

  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="05 · Watchlist"
        title={
          <>
            Your <span className="text-highlight">tracked names</span>, in one glance.
          </>
        }
        description={
          <>
            Stocks you've starred across the app. We surface{" "}
            <span className="text-highlight-soft">price, signal strength, and the latest news</span> for each.
          </>
        }
        strikeRate={items.length ? Math.min(95, 60 + items.length * 3) : 0}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Star className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <h3 className="mt-4 font-display text-lg font-bold">Your watchlist is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Tap the <span className="text-highlight">☆ star</span> on any stock, news item, or signal to start tracking it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s, i) => {
              const up = (s.change ?? 0) >= 0;
              return (
                <article
                  key={s.ticker}
                  className="group glass-card glass-card-hover rounded-2xl p-5 animate-fade-in relative"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {s.hasUpdate && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                      <Bell className="h-2.5 w-2.5" /> New
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base font-bold tracking-wide">{s.ticker}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{s.name ?? s.ticker}</div>
                    </div>
                    <button
                      onClick={() => remove(s.ticker)}
                      aria-label={`Remove ${s.ticker}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div className="num-display text-2xl text-foreground">
                      {s.price !== undefined ? `₹${s.price.toFixed(2)}` : "—"}
                    </div>
                    {s.change !== undefined && (
                      <div className={cn("inline-flex items-center gap-1 text-sm font-bold tabular-nums", up ? "text-bull" : "text-bear")}>
                        {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {up ? "+" : ""}{s.change.toFixed(2)}%
                      </div>
                    )}
                  </div>

                  {s.metric !== undefined && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 px-3 py-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.metricLabel ?? "Strike Rate"}
                      </span>
                      <span className="text-sm font-bold text-accent-blue tabular-nums">{s.metric}</span>
                    </div>
                  )}

                  {s.news && s.news.length > 0 && (
                    <div className="mt-4 border-t border-border/40 pt-3 space-y-2">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Latest</div>
                      {s.news.slice(0, 2).map((n, idx) => (
                        <div key={idx} className="text-[12px] leading-snug text-foreground/85">
                          <span className="text-foreground/95">{n.headline}</span>
                          <span className="ml-1 text-muted-foreground">· {n.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default Watchlist;
