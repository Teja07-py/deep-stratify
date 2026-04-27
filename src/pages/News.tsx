import { Flame, Zap, Circle, Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { cn } from "@/lib/utils";

type Attention = "full" | "partial" | "neutral";

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  matters?: string;
  source: string;
  time: string;
  attention: Attention;
  tickers: string[];
}

const items: NewsItem[] = [
  {
    id: 1,
    headline: "Infosys signs ₹4,200 Cr deal with Lufthansa Systems",
    summary: "Multi-year IT services contract spans cloud migration and ops. Margin profile in line with top-tier engagements.",
    matters: "Largest Europe win in 18 months — anchors FY26 deal book.",
    source: "MoneyControl",
    time: "12 min ago",
    attention: "full",
    tickers: ["INFY", "TCS"],
  },
  {
    id: 2,
    headline: "RBI keeps repo rate unchanged, stance shifts to neutral",
    summary: "MPC voted 5-1 to hold at 6.50% while signalling room for cuts later this year.",
    matters: "Banks rally on softer guidance — rate-sensitives in focus.",
    source: "Bloomberg",
    time: "38 min ago",
    attention: "full",
    tickers: ["HDFCBANK", "ICICIBANK", "AXISBANK"],
  },
  {
    id: 3,
    headline: "Tata Motors plans EV-only sub-brand for Q3 launch",
    summary: "Internal note suggests separate dealer network and dedicated battery JV in advanced stages.",
    source: "Reuters",
    time: "1 hr ago",
    attention: "partial",
    tickers: ["TATAMOTORS"],
  },
  {
    id: 4,
    headline: "Sun Pharma USFDA inspection closed with zero observations",
    summary: "Halol facility cleared — removes a major overhang on US generics franchise.",
    matters: "Re-rates the US revenue line; analysts likely to revisit estimates.",
    source: "Mint",
    time: "2 hr ago",
    attention: "full",
    tickers: ["SUNPHARMA"],
  },
  {
    id: 5,
    headline: "Crude steady at $84 ahead of OPEC+ meeting",
    summary: "Producers expected to extend voluntary cuts; spread between Brent and WTI narrows.",
    source: "Reuters",
    time: "3 hr ago",
    attention: "neutral",
    tickers: ["RELIANCE", "ONGC"],
  },
  {
    id: 6,
    headline: "Adani Ports volume hits new monthly record at Mundra",
    summary: "Container throughput up 14% YoY; coal handling lower on inventory normalization.",
    source: "ET Markets",
    time: "5 hr ago",
    attention: "partial",
    tickers: ["ADANIPORTS"],
  },
];

const attentionMeta: Record<Attention, { label: string; icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  full: { label: "Full Attention", icon: Flame, cls: "attention-full" },
  partial: { label: "Partial Attention", icon: Zap, cls: "attention-partial" },
  neutral: { label: "Neutral", icon: Circle, cls: "attention-neutral" },
};

const News = () => {
  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="03 · Newsdesk"
        title={
          <>
            Only the news that <span className="text-highlight">moves your book</span>.
          </>
        }
        description={
          <>
            Headlines ranked by attention — not chronology. We surface what
            <span className="text-highlight-soft"> changes a thesis</span>, and quietly retire what doesn't.
          </>
        }
        strikeRate={68}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {/* Filter strip */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 backdrop-blur-md flex-1 max-w-md">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search a ticker or topic…"
              className="flex-1 bg-transparent text-[13px] placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(["full", "partial", "neutral"] as Attention[]).map((a) => {
              const m = attentionMeta[a];
              const Icon = m.icon;
              return (
                <button
                  key={a}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all hover:-translate-y-px",
                    m.cls,
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {items.map((n, i) => {
            const m = attentionMeta[n.attention];
            const Icon = m.icon;
            return (
              <article
                key={n.id}
                className="group glass-card glass-card-hover rounded-2xl p-5 lg:p-6 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-6">
                  {/* Left: headline + summary */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2.5 flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          m.cls,
                        )}
                      >
                        <Icon className="h-2.5 w-2.5" />
                        {m.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {n.source} · {n.time}
                      </span>
                    </div>

                    <h3 className="font-display text-[19px] font-bold leading-snug tracking-tight text-foreground">
                      {n.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.summary}</p>

                    {n.matters && (
                      <p className="mt-3 text-[13px] leading-relaxed">
                        <span className="text-highlight">Why it matters.</span>{" "}
                        <span className="text-foreground/85">{n.matters}</span>
                      </p>
                    )}
                  </div>

                  {/* Right: impacted tickers */}
                  <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0 pl-4 border-l border-border/40">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Impacted</span>
                    <div className="flex flex-wrap justify-end gap-1.5 max-w-[180px]">
                      {n.tickers.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-foreground/85 transition-colors group-hover:border-accent/40 group-hover:text-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile tickers */}
                <div className="mt-3 flex md:hidden flex-wrap gap-1.5 pt-3 border-t border-border/40">
                  {n.tickers.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-foreground/85"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};

export default News;
