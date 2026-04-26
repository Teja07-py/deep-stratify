import { BarChart3, Newspaper, Users } from "lucide-react";
import { CountUp } from "./CountUp";
import { ConfidenceBar } from "./ConfidenceBar";

export const WhySignal = () => {
  return (
    <div className="glass-card gradient-border rounded-2xl p-6 lg:p-8">
      <div className="mb-7 flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-blue">Featured insight</p>
          <h3 className="mt-2 font-display text-[28px] font-extrabold tracking-[-0.022em]">
            <span className="font-serif italic font-normal">Why</span> this signal?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            INFY · Infosys Ltd <span className="text-border">·</span> AI breakdown
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Final score</p>
          <CountUp end={87} suffix="%" className="num-display mt-1.5 block text-[44px] text-bull" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Factor icon={BarChart3} title="Earnings" value="Positive" detail="Q3 beat by 8.2%" score={82} />
        <Factor icon={Users} title="Insider Activity" value="Buying" detail="₹12 Cr last 7 days" score={91} />
        <Factor icon={Newspaper} title="Sentiment" value="Strong" detail="142 bullish mentions" score={88} />
      </div>

      <div className="mt-6 rounded-xl border border-primary/20 bg-bull-soft p-4">
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold text-bull">Conviction signal.</span>{" "}
          <span className="text-muted-foreground">
            All three pillars align positively. Insider accumulation paired with earnings momentum suggests sustained upside through next quarter.
          </span>
        </p>
      </div>
    </div>
  );
};

const Factor = ({
  icon: Icon,
  title,
  value,
  detail,
  score,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  detail: string;
  score: number;
}) => (
  <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-bull">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
    </div>
    <div className="mb-1 font-display text-[22px] font-extrabold text-bull tracking-[-0.02em]">{value}</div>
    <p className="text-xs text-muted-foreground mb-3">{detail}</p>
    <ConfidenceBar value={score} signal="bullish" showGradient={false} />
  </div>
);
