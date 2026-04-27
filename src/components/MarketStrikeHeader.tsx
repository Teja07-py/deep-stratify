import { CountUp } from "./CountUp";

interface MarketStrikeHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  strikeRate?: number; // 0-100
}

export const MarketStrikeHeader = ({
  eyebrow,
  title,
  description,
  strikeRate = 68,
}: MarketStrikeHeaderProps) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="mx-auto max-w-7xl px-6 pt-14 pb-8">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        {/* Title block */}
        <div className="md:col-span-7 animate-fade-in">
          {eyebrow && (
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-blue">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[clamp(2.25rem,4.8vw,3.5rem)] font-black leading-[1.02] tracking-[-0.03em]">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Market Strike Rate panel */}
        <div className="md:col-span-5 md:pb-1 animate-fade-in" style={{ animationDelay: "120ms" }}>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Market Strike Rate
                </span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                {today}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <CountUp end={strikeRate} className="num-display text-[44px] text-bull" />
              <span className="font-display text-xl font-black text-bull">%</span>
              <span className="ml-1 text-sm font-semibold text-highlight">Bullish</span>
            </div>

            {/* Animated indicator bar */}
            <div className="mt-3 relative h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-destructive/70 via-accent/70 to-primary animate-fill-bar"
                style={{ ["--bar-width" as string]: `${strikeRate}%`, width: `${strikeRate}%` }}
              />
              {/* shimmer overlay */}
              <div
                className="absolute inset-y-0 left-0 rounded-full opacity-50"
                style={{
                  width: `${strikeRate}%`,
                  background:
                    "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.18), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s linear infinite",
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Bearish</span>
              <span>Pre-market · session open in 1h 24m</span>
              <span>Bullish</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
