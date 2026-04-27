import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockSignal } from "./StockCard";

export const MiniSignalRow = ({ stock, index = 0 }: { stock: StockSignal; index?: number }) => {
  const tone =
    stock.signal === "bullish" ? "text-bull" : stock.signal === "bearish" ? "text-bear" : "text-muted-foreground";
  const dot =
    stock.signal === "bullish" ? "bg-primary" : stock.signal === "bearish" ? "bg-destructive" : "bg-accent";
  return (
    <button
      className="group relative flex w-full items-center gap-4 rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-left backdrop-blur-md transition-all hover:border-accent/40 hover:bg-card/70 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot, "shadow-[0_0_8px_currentColor]")} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold tracking-wide">{stock.ticker}</span>
          <span className="text-xs text-muted-foreground truncate">{stock.name}</span>
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {stock.reasons.earnings} · {stock.reasons.insider}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold tabular-nums">{stock.price}</div>
        <div className={cn("text-[11px] font-semibold tabular-nums", tone)}>{stock.change}</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={cn("text-[11px] font-bold tabular-nums", tone)}>{stock.confidence}%</div>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </button>
  );
};
