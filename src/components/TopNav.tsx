import { Bell, Search, Sparkles, User } from "lucide-react";
import { CountUp } from "./CountUp";

export const TopNav = () => {
  const mood = 68;
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/50">
      {/* hairline glow */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-6 px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.75} />
            <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-primary to-accent opacity-40 blur-md -z-10" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[17px] font-bold tracking-tight leading-none">Alpha</span>
            <span className="font-serif italic text-[18px] leading-none text-muted-foreground">signals</span>
          </div>
        </a>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {["Signals", "Screener", "Heatmap", "Reports"].map((l, i) => (
            <a
              key={l}
              href="#"
              className={
                "relative px-3 py-1.5 text-[13px] font-medium transition-colors " +
                (i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground")
              }
            >
              {l}
              {i === 0 && (
                <span className="absolute inset-x-3 -bottom-[18px] h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              )}
            </a>
          ))}
        </nav>

        {/* spacer */}
        <div className="flex-1" />

        {/* Market mood — refined */}
        <div className="hidden md:flex items-center gap-3 rounded-full border border-border/60 bg-card/40 pl-3 pr-1 py-1 backdrop-blur-md shadow-[0_1px_0_0_hsl(var(--foreground)/0.04)_inset]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Mood
          </span>
          <div className="relative h-1 w-20 overflow-hidden rounded-full bg-muted/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-primary animate-fill-bar"
              style={{ ["--bar-width" as string]: `${mood}%`, width: `${mood}%` }}
            />
          </div>
          <div className="flex items-baseline gap-1 rounded-full bg-primary/10 px-2.5 py-0.5">
            <CountUp end={mood} suffix="%" className="text-[12px] font-bold text-bull tabular-nums leading-none" />
            <span className="font-serif italic text-[12px] leading-none text-bull/80">bullish</span>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
            <Search className="h-[15px] w-[15px]" />
          </button>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
            <Bell className="h-[15px] w-[15px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-background animate-pulse-glow" />
          </button>
          <div className="mx-1 h-6 w-px bg-border/60" />
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-background transition-transform hover:scale-105">
            <User className="h-[14px] w-[14px]" strokeWidth={2.75} />
          </button>
        </div>
      </div>
    </header>
  );
};
