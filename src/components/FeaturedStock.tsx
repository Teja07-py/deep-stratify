import { ArrowUpRight, BarChart3, Newspaper, Users } from "lucide-react";
import { ConfidenceBar } from "./ConfidenceBar";
import { CountUp } from "./CountUp";
import { SignalBadge } from "./SignalBadge";
import { cn } from "@/lib/utils";
import type { StockSignal } from "./StockCard";

export const FeaturedStock = ({ stock }: { stock: StockSignal }) => {
  const tone =
    stock.signal === "bullish" ? "text-bull" : stock.signal === "bearish" ? "text-bear" : "text-accent-blue";
  return (
    <div className="group relative overflow-hidden rounded-[20px] gradient-border bg-gradient-card backdrop-blur-xl animate-fade-in">
      {/* ambient glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40",
          stock.signal === "bullish" && "bg-primary/30",
          stock.signal === "bearish" && "bg-destructive/30",
          stock.signal === "neutral" && "bg-accent/30",
        )}
      />

      <div className="relative grid gap-8 p-7 lg:grid-cols-[1.15fr_1fr] lg:p-9">
        {/* Left — identity + price */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-accent-blue">
            <span className="h-1 w-1 rounded-full bg-accent-blue" />
            Top conviction · today
          </div>

          <h2 className="mt-3 flex items-baseline gap-3 text-[40px] leading-[1.05] font-bold tracking-tight">
            {stock.name}
            <span className="font-serif italic text-2xl text-muted-foreground">{stock.ticker.toLowerCase()}</span>
          </h2>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Three pillars aligned. Insider accumulation paired with an{" "}
            <span className="font-serif italic text-foreground/90">unusually clean</span> earnings beat — the kind of
            setup we wait weeks for.
          </p>

          <div className="mt-auto pt-7 flex items-end gap-5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                Last
              </div>
              <div className="text-4xl font-bold tabular-nums leading-none">{stock.price}</div>
            </div>
            <div className={cn("pb-1 text-base font-semibold tabular-nums", tone)}>{stock.change}</div>
            <div className="ml-auto">
              <SignalBadge signal={stock.signal} />
            </div>
          </div>
        </div>

        {/* Right — conviction + reasons */}
        <div className="rounded-2xl border border-border/50 bg-background/30 p-6 backdrop-blur-md">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Conviction
            </span>
            <span className="font-serif italic text-xs text-muted-foreground">scored by 14 models</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <CountUp end={stock.confidence} className={cn("text-6xl font-extrabold tabular-nums leading-none", tone)} />
            <span className={cn("text-2xl font-bold", tone)}>%</span>
          </div>

          <div className="mt-4">
            <ConfidenceBar value={stock.confidence} signal={stock.signal} />
          </div>

          <div className="mt-6 space-y-3 border-t border-border/40 pt-5">
            <Reason icon={BarChart3} label="Earnings" value={stock.reasons.earnings} />
            <Reason icon={Users} label="Insider" value={stock.reasons.insider} />
            <Reason icon={Newspaper} label="Sentiment" value={stock.reasons.sentiment} />
          </div>

          <button className="mt-6 group/btn inline-flex w-full items-center justify-between rounded-xl bg-foreground/95 px-4 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-px">
            Open full insight
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Reason = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label}</span>
    </div>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);
