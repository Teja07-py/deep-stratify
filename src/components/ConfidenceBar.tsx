import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  value: number; // 0-100
  signal: "bullish" | "bearish" | "neutral";
  className?: string;
  showGradient?: boolean;
}

export const ConfidenceBar = ({ value, signal, className, showGradient = true }: ConfidenceBarProps) => {
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted/40", className)}>
      {showGradient && (
        <div className="absolute inset-0 opacity-20 bg-gradient-signal" />
      )}
      <div
        className={cn(
          "relative h-full rounded-full animate-fill-bar",
          signal === "bullish" && "bg-gradient-to-r from-primary/70 to-primary glow-bull",
          signal === "bearish" && "bg-gradient-to-r from-destructive/70 to-destructive glow-bear",
          signal === "neutral" && "bg-gradient-to-r from-accent/70 to-accent glow-accent",
        )}
        style={{ ["--bar-width" as string]: `${value}%`, width: `${value}%` }}
      />
    </div>
  );
};
