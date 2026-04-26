import { cn } from "@/lib/utils";

const ticks = [
  { s: "INFY", c: "+2.4", p: "1,847" },
  { s: "TATAMOTORS", c: "+3.8", p: "942" },
  { s: "ADANIPORTS", c: "-2.1", p: "1,284" },
  { s: "HDFCBANK", c: "+1.6", p: "1,672" },
  { s: "RELIANCE", c: "+0.3", p: "2,945" },
  { s: "SUNPHARMA", c: "+4.2", p: "1,512" },
  { s: "ICICIBANK", c: "+1.1", p: "1,098" },
  { s: "WIPRO", c: "-0.8", p: "458" },
  { s: "MARUTI", c: "+2.7", p: "12,340" },
  { s: "BAJFINANCE", c: "-1.4", p: "6,820" },
  { s: "LT", c: "+0.9", p: "3,512" },
  { s: "AXISBANK", c: "+2.0", p: "1,142" },
];

export const TickerTape = () => {
  const row = [...ticks, ...ticks];
  return (
    <div className="border-y border-border/40 bg-card/30 backdrop-blur-md overflow-hidden">
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap py-2.5 will-change-transform">
          {row.map((t, i) => {
            const up = t.c.startsWith("+");
            return (
              <div key={i} className="flex items-center gap-2 px-5 text-xs">
                <span className="font-semibold tracking-wide text-foreground/90">{t.s}</span>
                <span className={cn("font-bold tabular-nums", up ? "text-bull" : "text-bear")}>
                  {up ? "▲" : "▼"} {t.c}%
                </span>
                <span className="tabular-nums text-muted-foreground">₹{t.p}</span>
                <span className="text-border/80">•</span>
              </div>
            );
          })}
        </div>
        {/* edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
};
