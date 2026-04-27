import { Activity, Crosshair, Target, Zap } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { CountUp } from "@/components/CountUp";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { cn } from "@/lib/utils";

const breakdown = [
  { label: "Earnings momentum", value: 88, tone: "bull" },
  { label: "Insider activity", value: 76, tone: "bull" },
  { label: "Options flow", value: 64, tone: "accent" },
  { label: "Sentiment delta", value: 71, tone: "bull" },
  { label: "Volume profile", value: 52, tone: "accent" },
];

const StrikeMetrics = () => {
  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="02 · Strike intelligence"
        title={
          <>
            Inside the model — <span className="text-highlight">how Strike Rate is built</span>.
          </>
        }
        description={
          <>
            Five orthogonal signals, weighted dynamically. Below is today's contribution map and the
            <span className="text-highlight-soft"> historical accuracy</span> of each layer.
          </>
        }
        strikeRate={68}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {/* Metric headline cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard icon={Target} label="Avg Strike Rate" value={74} suffix="%" hint="rolling 30 day" tone="bull" />
          <MetricCard icon={Crosshair} label="Strike Strength" value={8.4} suffix="/10" hint="conviction index" tone="accent" />
          <MetricCard icon={Activity} label="Historical Accuracy" value={81} suffix="%" hint="trailing 12Q" tone="bull" />
        </div>

        {/* Two-column deep dive */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Breakdown */}
          <div className="glass-card rounded-2xl p-6 lg:p-8">
            <div className="mb-6 flex items-baseline justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-blue">
                  Today's signal stack
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight">
                  Component <span className="text-highlight">contribution</span>
                </h2>
              </div>
              <Zap className="h-5 w-5 text-accent-blue" />
            </div>

            <div className="space-y-5">
              {breakdown.map((b, i) => (
                <div key={b.label} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-sm font-medium text-foreground">{b.label}</span>
                    <span
                      className={cn(
                        "text-base font-extrabold tabular-nums",
                        b.tone === "bull" && "text-bull",
                        b.tone === "accent" && "text-accent-blue",
                      )}
                    >
                      {b.value}
                    </span>
                  </div>
                  <ConfidenceBar value={b.value} signal={b.tone === "bull" ? "bullish" : "neutral"} showGradient={false} />
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-sm leading-relaxed">
                <span className="text-highlight">Read.</span>{" "}
                <span className="text-muted-foreground">
                  When earnings momentum and insider activity both clear 75, the model has historically
                  delivered an 84% Strike Rate within the next 10 sessions.
                </span>
              </p>
            </div>
          </div>

          {/* Confidence + accuracy chart */}
          <div className="glass-card rounded-2xl p-6 lg:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-blue">
              Accuracy curve
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight">
              Strike Strength <span className="text-highlight">vs. outcome</span>
            </h2>

            {/* simple curve */}
            <div className="mt-6 relative h-44 w-full">
              <svg viewBox="0 0 200 100" className="h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curve" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 C30,72 60,60 90,42 C120,28 150,18 200,10 L200,100 L0,100 Z"
                  fill="url(#curve)"
                />
                <path
                  d="M0,80 C30,72 60,60 90,42 C120,28 150,18 200,10"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Low</span>
                <span>Mid</span>
                <span>High</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/40 pt-5">
              <Mini label="Hit rate" value="81%" />
              <Mini label="Avg gain" value="+4.2%" tone="bull" />
              <Mini label="Drawdown" value="-1.1%" tone="bear" />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  suffix,
  hint,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix: string;
  hint: string;
  tone: "bull" | "accent";
}) => (
  <div className="glass-card glass-card-hover rounded-2xl p-6">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <div className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg",
        tone === "bull" ? "bg-primary/15 text-bull" : "bg-accent/15 text-accent-blue",
      )}>
        <Icon className="h-3.5 w-3.5" />
      </div>
    </div>
    <div className="mt-4 flex items-baseline gap-1">
      <CountUp end={value} className={cn("num-display text-[40px]", tone === "bull" ? "text-bull" : "text-accent-blue")} />
      <span className={cn("font-display text-lg font-black", tone === "bull" ? "text-bull" : "text-accent-blue")}>{suffix}</span>
    </div>
    <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
  </div>
);

const Mini = ({ label, value, tone }: { label: string; value: string; tone?: "bull" | "bear" }) => (
  <div>
    <div className={cn("text-lg font-extrabold tabular-nums", tone === "bull" && "text-bull", tone === "bear" && "text-bear", !tone && "text-foreground")}>
      {value}
    </div>
    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);

export default StrikeMetrics;
