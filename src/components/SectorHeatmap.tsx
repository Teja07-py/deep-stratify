import { cn } from "@/lib/utils";

const sectors = [
  { name: "IT", score: 78 },
  { name: "Banking", score: 64 },
  { name: "Pharma", score: 52 },
  { name: "Auto", score: 71 },
  { name: "Energy", score: 38 },
  { name: "FMCG", score: 58 },
  { name: "Metals", score: 28 },
  { name: "Realty", score: 44 },
  { name: "Telecom", score: 67 },
  { name: "Infra", score: 49 },
  { name: "Media", score: 33 },
  { name: "PSU", score: 73 },
];

const colorFor = (s: number) => {
  if (s >= 65) return { bg: "bg-primary/15 hover:bg-primary/25", border: "border-primary/30", text: "text-bull", glow: "hover:shadow-[0_0_20px_hsl(142_100%_39%/0.3)]" };
  if (s >= 50) return { bg: "bg-accent/10 hover:bg-accent/20", border: "border-accent/30", text: "text-accent-blue", glow: "hover:shadow-[0_0_20px_hsl(217_100%_58%/0.3)]" };
  if (s >= 40) return { bg: "bg-muted/40 hover:bg-muted/60", border: "border-border", text: "text-muted-foreground", glow: "" };
  return { bg: "bg-destructive/10 hover:bg-destructive/20", border: "border-destructive/30", text: "text-bear", glow: "hover:shadow-[0_0_20px_hsl(14_100%_50%/0.3)]" };
};

export const SectorHeatmap = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sector Pulse</h2>
          <p className="mt-1 text-sm text-muted-foreground">Live sentiment across 12 sectors</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
          <LegendDot className="bg-destructive" label="Bearish" />
          <LegendDot className="bg-accent" label="Neutral" />
          <LegendDot className="bg-primary" label="Bullish" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {sectors.map((s, i) => {
          const c = colorFor(s.score);
          return (
            <div
              key={s.name}
              className={cn(
                "group relative cursor-pointer rounded-xl border p-4 backdrop-blur-sm transition-all duration-300 animate-fade-in",
                c.bg,
                c.border,
                c.glow,
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="text-sm font-semibold text-foreground">{s.name}</div>
              <div className={cn("mt-2 text-2xl font-extrabold tabular-nums", c.text)}>{s.score}</div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background/40">
                <div
                  className={cn(
                    "h-full rounded-full",
                    s.score >= 65 ? "bg-primary" : s.score >= 50 ? "bg-accent" : s.score >= 40 ? "bg-muted-foreground" : "bg-destructive",
                  )}
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const LegendDot = ({ className, label }: { className: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className={cn("h-2 w-2 rounded-full", className)} />
    <span>{label}</span>
  </div>
);
