import { ArrowUpRight, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { CountUp } from "@/components/CountUp";
import { cn } from "@/lib/utils";

interface EarningsRow {
  ticker: string;
  name: string;
  date: string;
  when: "BMO" | "AMC";
  strikeRate: number;
  expectedMove: string;
  trend: "up" | "down" | "flat";
}

const upcoming: EarningsRow[] = [
  { ticker: "TCS", name: "Tata Consultancy", date: "Tue, 30 Apr", when: "AMC", strikeRate: 88, expectedMove: "±3.4%", trend: "up" },
  { ticker: "INFY", name: "Infosys", date: "Wed, 1 May", when: "AMC", strikeRate: 84, expectedMove: "±4.1%", trend: "up" },
  { ticker: "HDFCBANK", name: "HDFC Bank", date: "Thu, 2 May", when: "BMO", strikeRate: 76, expectedMove: "±2.2%", trend: "flat" },
  { ticker: "RELIANCE", name: "Reliance Inds", date: "Fri, 3 May", when: "AMC", strikeRate: 71, expectedMove: "±3.0%", trend: "up" },
  { ticker: "ADANIPORTS", name: "Adani Ports", date: "Mon, 6 May", when: "BMO", strikeRate: 58, expectedMove: "±5.6%", trend: "down" },
];

const recent = [
  { ticker: "MARUTI", name: "Maruti Suzuki", result: "Beat", surprise: "+8.4%", strikeRate: 92, change: "+5.1%" },
  { ticker: "BAJFINANCE", name: "Bajaj Finance", result: "Miss", surprise: "-3.2%", strikeRate: 41, change: "-2.7%" },
  { ticker: "SUNPHARMA", name: "Sun Pharma", result: "Beat", surprise: "+11.2%", strikeRate: 89, change: "+4.0%" },
  { ticker: "WIPRO", name: "Wipro", result: "Inline", surprise: "+0.4%", strikeRate: 62, change: "-0.3%" },
];

const Results = () => {
  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="01 · Earnings calendar"
        title={
          <>
            What the <span className="text-highlight">market is bracing</span> for this week.
          </>
        }
        description={
          <>
            12 names report in the next 5 sessions. We surface the ones with the{" "}
            <span className="text-highlight-soft">strongest setup</span> heading in.
          </>
        }
        strikeRate={73}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Upcoming */}
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent-blue" />
                <h2 className="text-base font-bold">Upcoming Earnings</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Next 7 days</span>
            </div>

            <div className="space-y-2">
              {upcoming.map((r, i) => (
                <div
                  key={r.ticker}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 transition-all hover:border-accent/40 hover:bg-secondary/60 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-24 shrink-0">
                    <div className="text-sm font-bold tracking-wide">{r.ticker}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{r.name}</div>
                  </div>
                  <div className="hidden md:flex flex-col w-28 shrink-0">
                    <div className="text-xs text-foreground">{r.date}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {r.when === "BMO" ? "Before open" : "After close"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span>Strike Rate</span>
                      <span className={cn(
                        "tabular-nums font-bold text-sm",
                        r.strikeRate >= 75 ? "text-bull" : r.strikeRate >= 55 ? "text-accent-blue" : "text-bear",
                      )}>{r.strikeRate}%</span>
                    </div>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted/40">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          r.strikeRate >= 75 ? "bg-primary" : r.strikeRate >= 55 ? "bg-accent" : "bg-destructive",
                        )}
                        style={{ width: `${r.strikeRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="hidden sm:block w-16 text-right text-xs tabular-nums text-muted-foreground">
                    {r.expectedMove}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent-blue" />
                <h2 className="text-base font-bold">Recent Results</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Last 48h</span>
            </div>

            <div className="space-y-3">
              {recent.map((r, i) => {
                const beat = r.result === "Beat";
                return (
                  <div
                    key={r.ticker}
                    className="rounded-xl border border-border/50 bg-secondary/30 p-4 animate-fade-in"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-sm font-bold tracking-wide">{r.ticker}</div>
                        <div className="text-[11px] text-muted-foreground">{r.name}</div>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          beat && "border-primary/40 bg-primary/10 text-bull",
                          r.result === "Miss" && "border-destructive/40 bg-destructive/10 text-bear",
                          r.result === "Inline" && "border-accent/30 bg-accent/10 text-accent-blue",
                        )}
                      >
                        {r.result}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                      <Stat label="Surprise" value={r.surprise} tone={beat ? "bull" : r.result === "Miss" ? "bear" : "neutral"} />
                      <Stat label="Strike Rate" value={`${r.strikeRate}%`} tone={r.strikeRate >= 75 ? "bull" : r.strikeRate >= 55 ? "accent" : "bear"} />
                      <Stat label="1D Move" value={r.change} tone={r.change.startsWith("+") ? "bull" : "bear"} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance trend strip */}
        <div className="mt-6 glass-card rounded-2xl p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Performance trend</p>
              <h3 className="mt-1.5 font-display text-xl font-extrabold tracking-tight">
                Strike Rate accuracy — <span className="text-highlight">last 12 quarters</span>
              </h3>
            </div>
            <div className="flex items-baseline gap-1">
              <CountUp end={81} className="num-display text-3xl text-bull" />
              <span className="font-bold text-bull">%</span>
              <TrendingUp className="ml-2 h-4 w-4 text-bull" />
            </div>
          </div>
          {/* sparkline */}
          <div className="flex items-end gap-1.5 h-20">
            {[62, 68, 64, 71, 74, 70, 78, 76, 81, 79, 84, 81].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary/80 transition-all hover:from-primary/50 hover:to-primary"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

const Stat = ({ label, value, tone }: { label: string; value: string; tone: "bull" | "bear" | "accent" | "neutral" }) => (
  <div>
    <div
      className={cn(
        "text-base font-extrabold tabular-nums",
        tone === "bull" && "text-bull",
        tone === "bear" && "text-bear",
        tone === "accent" && "text-accent-blue",
        tone === "neutral" && "text-foreground",
      )}
    >
      {value}
    </div>
    <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);

export default Results;
