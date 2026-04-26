import { Bell, Sparkles, User } from "lucide-react";
import { CountUp } from "./CountUp";

export const TopNav = () => {
  const mood = 68;
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent opacity-50 blur-md -z-10" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tracking-tight">Alpha</span>
            <span className="text-lg font-light text-muted-foreground">Signals</span>
          </div>
        </div>

        {/* Market mood */}
        <div className="hidden md:flex items-center gap-3 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">Market Mood</span>
          <div className="flex items-center gap-2">
            <CountUp end={mood} suffix="%" className="text-sm font-bold text-bull tabular-nums" />
            <span className="text-xs font-semibold text-bull">Bullish</span>
          </div>
          <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-muted/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-primary animate-fill-bar"
              style={{ ["--bar-width" as string]: `${mood}%`, width: `${mood}%` }}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-all hover:border-accent/60 hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-glow" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-background transition-transform hover:scale-105">
            <User className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
};
