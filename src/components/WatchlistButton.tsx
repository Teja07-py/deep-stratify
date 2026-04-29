import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWatchlist, WatchlistItem } from "@/hooks/useWatchlist";

interface Props {
  item: Omit<WatchlistItem, "addedAt">;
  size?: "sm" | "md";
  className?: string;
  stopPropagation?: boolean;
}

export const WatchlistButton = ({ item, size = "sm", className, stopPropagation = true }: Props) => {
  const { has, toggle } = useWatchlist();
  const active = has(item.ticker);
  const dim = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      aria-label={active ? `Remove ${item.ticker} from watchlist` : `Add ${item.ticker} to watchlist`}
      title={active ? "Remove from watchlist" : "Add to watchlist"}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        toggle(item);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border transition-all duration-200",
        dim,
        active
          ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_12px_-2px_hsl(var(--accent)/var(--glow-intensity))]"
          : "border-border/60 bg-background/30 text-muted-foreground hover:text-accent hover:border-accent/40 hover:shadow-[0_0_10px_-2px_hsl(var(--accent)/var(--glow-intensity-soft))]",
        className,
      )}
    >
      <Star className={cn(icon, "transition-transform duration-200", active && "fill-current scale-110")} strokeWidth={2.25} />
    </button>
  );
};
