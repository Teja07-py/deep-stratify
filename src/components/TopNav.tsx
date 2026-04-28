import { Bell, BarChart3, Newspaper, Sparkles, Star, User, Zap, Inbox } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";

const navItems = [
  { to: "/results", label: "Results", icon: BarChart3 },
  { to: "/strike-metrics", label: "Strike Metrics", icon: Zap },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/ratings", label: "Ratings", icon: Star },
  { to: "/orders", label: "Orders", icon: Inbox },
];

export const TopNav = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/45">
      {/* hairline glow */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto flex h-[64px] max-w-7xl items-center gap-6 px-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-black p-1.5">
            <img
              src="/placeholder.svg"
              alt="TrackiT logo"
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-primary to-accent opacity-30 blur-md -z-10" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[17px] font-bold tracking-tight leading-none">Tracki</span>
            <span className="text-[17px] font-bold leading-none text-accent">T</span>
          </div>
        </NavLink>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-0.5 ml-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-all duration-200",
                  "hover:-translate-y-px",
                  isActive
                    ? "text-foreground bg-accent/10 ring-1 ring-accent/30 shadow-[0_0_18px_-6px_hsl(var(--accent)/0.55)]"
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
