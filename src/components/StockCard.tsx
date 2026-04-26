import { ArrowRight, BarChart3, Users, Newspaper } from "lucide-react";
import { ConfidenceBar } from "./ConfidenceBar";
import { SignalBadge } from "./SignalBadge";
import { CountUp } from "./CountUp";
import { cn } from "@/lib/utils";

export interface StockSignal {
  ticker: string;
  name: string;
  signal: "bullish" | "bearish" | "neutral";
  confidence: number;
  price: string;
  change: string;
  reasons: { earnings: string; insider: string; sentiment: string };
}

export const StockCard = ({ stock, index = 0 }: { stock: StockSignal; index?: number }) => {
  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        className={cn(
          "relative w-[340px] sm:w-[380px] shrink-0 rounded-2xl p-6 gradient-border",
          "bg-gradient-card backdrop-blur-xl",
          "transition-all duration-500 ease-out",
          "hover:-translate-y-2 hover:shadow-card-hover cursor-pointer",
          stock.signal === "bullish" && "hover:shadow-[0_20px_50px_-12px_hsl(142_100%_39%_/_0.25)]",
          stock.signal === "bearish" && "hover:shadow-[0_20px_50px_-12px_hsl(14_100%_50%_/_0.25)]",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-xs font-medium text-muted-foreground tracking-wider mb-1">{stock.ticker}</div>
            <h3 className="text-xl font-bold text-foreground">{stock.name}</h3>
          </div>
          <SignalBadge signal={stock.signal} />
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold tabular-nums">{stock.price}</span>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              stock.signal === "bullish" ? "text-bull" : stock.signal === "bearish" ? "text-bear" : "text-muted-foreground",
            )}
          >
            {stock.change}
          </span>
        </div>

        {/* Confidence */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              AI Confidence
            </span>
            <CountUp
              end={stock.confidence}
              suffix="%"
              className={cn(
                "text-2xl font-extrabold tabular-nums",
                stock.signal === "bullish" && "text-bull",
                stock.signal === "bearish" && "text-bear",
                stock.signal === "neutral" && "text-accent-blue",
              )}
            />
          </div>
          <ConfidenceBar value={stock.confidence} signal={stock.signal} />
        </div>

        {/* Reasons */}
        <div className="space-y-2.5 mb-6">
          <ReasonRow icon={BarChart3} label="Earnings" value={stock.reasons.earnings} signal={stock.signal} />
          <ReasonRow icon={Users} label="Insider" value={stock.reasons.insider} signal={stock.signal} />
          <ReasonRow icon={Newspaper} label="Sentiment" value={stock.reasons.sentiment} signal={stock.signal} />
        </div>

        {/* CTA */}
        <button className="group/btn flex w-full items-center justify-between rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-accent/60 hover:bg-accent/10">
          <span>View Insight</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

const ReasonRow = ({
  icon: Icon,
  label,
  value,
  signal,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  signal: "bullish" | "bearish" | "neutral";
}) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label}</span>
    </div>
    <span
      className={cn(
        "font-semibold",
        signal === "bullish" && "text-bull",
        signal === "bearish" && "text-bear",
        signal === "neutral" && "text-foreground",
      )}
    >
      {value}
    </span>
  </div>
);
