import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SignalBadgeProps {
  signal: "bullish" | "bearish" | "neutral";
  className?: string;
  size?: "sm" | "md";
}

export const SignalBadge = ({ signal, className, size = "md" }: SignalBadgeProps) => {
  const Icon = signal === "bullish" ? TrendingUp : signal === "bearish" ? TrendingDown : Minus;
  const label = signal === "bullish" ? "BULLISH" : signal === "bearish" ? "BEARISH" : "NEUTRAL";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider backdrop-blur-sm",
        size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]",
        signal === "bullish" && "border-primary/40 bg-primary/10 text-bull glow-bull",
        signal === "bearish" && "border-destructive/40 bg-destructive/10 text-bear glow-bear",
        signal === "neutral" && "border-accent/40 bg-accent/10 text-accent-blue",
        className,
      )}
    >
      <Icon className={size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} strokeWidth={2.5} />
      {label}
    </div>
  );
};
