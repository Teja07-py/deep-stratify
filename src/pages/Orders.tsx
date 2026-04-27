import { ArrowUpRight, Clock, Filter } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { cn } from "@/lib/utils";

interface SignalRow {
  id: number;
  ticker: string;
  name: string;
  direction: "long" | "short";
  strikeRate: number;
  strength: "High" | "Medium" | "Low";
  explanation: string;
  timestamp: string;
  status: "active" | "filled" | "watching";
}

const signals: SignalRow[] = [
  {
    id: 1, ticker: "INFY", name: "Infosys", direction: "long", strikeRate: 87, strength: "High",
    explanation: "Earnings beat + insider accumulation + sentiment surge across analyst desks.",
    timestamp: "08:42 IST", status: "active",
  },
  {
    id: 2, ticker: "TATAMOTORS", name: "Tata Motors", direction: "long", strikeRate: 91, strength: "High",
    explanation: "EV sub-brand catalyst pre-launch. Volume signature matches Q3 2024 setup.",
    timestamp: "08:31 IST", status: "active",
  },
  {
    id: 3, ticker: "ADANIPORTS", name: "Adani Ports", direction: "short", strikeRate: 76, strength: "Medium",
    explanation: "Block-sell pattern + bearish reversal at key supply zone.",
    timestamp: "07:58 IST", status: "watching",
  },
  {
    id: 4, ticker: "HDFCBANK", name: "HDFC Bank", direction: "long", strikeRate: 82, strength: "High",
    explanation: "Rate stance shift + analyst upgrade stack — re-rating window opening.",
    timestamp: "07:22 IST", status: "filled",
  },
  {
    id: 5, ticker: "SUNPHARMA", name: "Sun Pharma", direction: "long", strikeRate: 89, strength: "High",
    explanation: "Halol clearance removes US overhang. Estimate revisions likely.",
    timestamp: "Yesterday · 16:04", status: "filled",
  },
  {
    id: 6, ticker: "WIPRO", name: "Wipro", direction: "short", strikeRate: 58, strength: "Low",
    explanation: "Margin compression vs peers; deal momentum lagging.",
    timestamp: "Yesterday · 14:21", status: "watching",
  },
];

const statusCls: Record<SignalRow["status"], string> = {
  active: "border-primary/40 bg-primary/10 text-bull",
  filled: "border-accent/30 bg-accent/10 text-accent-blue",
  watching: "border-border/60 bg-secondary/50 text-muted-foreground",
};

const Orders = () => {
  const counts = {
    active: signals.filter((s) => s.status === "active").length,
    filled: signals.filter((s) => s.status === "filled").length,
    watching: signals.filter((s) => s.status === "watching").length,
  };

  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="04 · Generated signals"
        title={
          <>
            Your active <span className="text-highlight">strike book</span>.
          </>
        }
        description={
          <>
            Every signal the model has cleared in the last 48 hours, with reasoning and timestamp.
            Filter by <span className="text-highlight-soft">status, direction, or strength</span>.
          </>
        }
        strikeRate={68}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {/* Summary strip */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <SummaryTile label="Active" value={counts.active} tone="bull" />
          <SummaryTile label="Filled" value={counts.filled} tone="accent" />
          <SummaryTile label="Watching" value={counts.watching} tone="muted" />
        </div>

        {/* Filter row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            All signals
          </div>
          <div className="flex items-center gap-1.5">
            {["All", "Long", "Short"].map((f, i) => (
              <button
                key={f}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold transition-all hover:-translate-y-px",
                  i === 0
                    ? "border-accent/40 bg-accent/10 text-foreground"
                    : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Signal list */}
        <div className="space-y-3">
          {signals.map((s, i) => (
            <article
              key={s.id}
              className="group glass-card glass-card-hover rounded-2xl p-5 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                {/* Identity */}
                <div className="flex items-center gap-4 md:w-56">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border text-[10px] font-bold uppercase tracking-wider",
                      s.direction === "long"
                        ? "border-primary/40 bg-primary/10 text-bull"
                        : "border-destructive/40 bg-destructive/10 text-bear",
                    )}
                  >
                    {s.direction === "long" ? "LONG" : "SHRT"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold tracking-wide">{s.ticker}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{s.name}</div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {s.explanation}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {s.timestamp}
                    </span>
                    <span>·</span>
                    <span>Strike Strength: <span className="text-highlight-soft">{s.strength}</span></span>
                  </div>
                </div>

                {/* Right: rate + status */}
                <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Strike Rate</div>
                    <div
                      className={cn(
                        "num-display text-2xl",
                        s.strikeRate >= 80 ? "text-bull" : s.strikeRate >= 65 ? "text-accent-blue" : "text-muted-foreground",
                      )}
                    >
                      {s.strikeRate}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        statusCls[s.status],
                      )}
                    >
                      {s.status}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

const SummaryTile = ({ label, value, tone }: { label: string; value: number; tone: "bull" | "accent" | "muted" }) => (
  <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    <span
      className={cn(
        "num-display text-3xl",
        tone === "bull" && "text-bull",
        tone === "accent" && "text-accent-blue",
        tone === "muted" && "text-foreground",
      )}
    >
      {value}
    </span>
  </div>
);

export default Orders;
