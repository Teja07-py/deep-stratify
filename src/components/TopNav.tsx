import { Bell, BarChart3, Newspaper, Star, User, Zap, Inbox } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";

const primaryNav = [
  { to: "/results", label: "Results", icon: BarChart3 },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/ratings", label: "Ratings", icon: Star },
  { to: "/orders", label: "Orders", icon: Inbox },
  { to: "/watchlist", label: "Watchlist", icon: Star },
];

export const TopNav = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/45">
      {/* hairline glow */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto flex h-[64px] max-w-7xl items-center gap-6 px-6">
        {/* Logo + Brand */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-black p-1.5 ring-1 ring-white/10 transition-shadow group-hover:shadow-[0_0_18px_-2px_hsl(var(--accent)/var(--glow-intensity))]">
            <Zap
              className="h-full w-full text-[#3B82F6] drop-shadow-[0_0_6px_hsl(217_91%_60%/0.6)]"
              fill="currentColor"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-[#3B82F6] to-[#DC143C] opacity-25 blur-md -z-10" />
          </div>
          <span className="text-[17px] font-bold tracking-tight leading-none bg-gradient-to-r from-[#3B82F6] via-foreground to-[#DC143C] bg-clip-text text-transparent">
            TracKit
          </span>
        </NavLink>

        {/* Primary nav */}
        <nav className="hidden lg:flex items-center gap-0.5 ml-3">
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-all duration-200",
                  "hover:-translate-y-px",
                  isActive
                    ? "text-foreground ring-1 is-active-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60",
                )
              }
            >
              <Icon className="h-[14px] w-[14px]" strokeWidth={2.25} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* spacer */}
        <div className="flex-1" />

        {/* Strike Metrics — anchored far right */}
        <nav className="hidden lg:flex items-center">
          <NavLink
            to="/strike-metrics"
            className={({ isActive }) =>
              cn(
                "group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                "border hover:-translate-y-px",
                isActive
                  ? "text-foreground border-accent/50 bg-accent/15 shadow-[0_0_22px_-4px_hsl(var(--accent)/calc(var(--glow-intensity)+0.15))]"
                  : "text-foreground/80 border-border/60 bg-card/40 hover:text-foreground hover:border-accent/40 hover:shadow-[0_0_14px_-4px_hsl(var(--accent)/var(--glow-intensity))]",
              )
            }
          >
            <Zap className="h-[14px] w-[14px]" strokeWidth={2.5} />
            <span>Strike Metrics</span>
          </NavLink>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          <SearchBar />
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
