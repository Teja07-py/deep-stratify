import { useMemo, useState } from "react";
import { Flame, Zap, Circle, Search, ArrowDownUp, X, ChevronDown, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { WatchlistButton } from "@/components/WatchlistButton";
import { cn } from "@/lib/utils";

type Attention = "full" | "partial" | "neutral";
type Priority = "high" | "medium" | "low";
type Category =
  | "Breaking"
  | "Earnings"
  | "Macro"
  | "Policy"
  | "Analyst"
  | "Commodities"
  | "FII/DII"
  | "M&A"
  | "IPO";
type SortKey = "latest" | "attention" | "relevant";

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  matters?: string;
  source: string;
  time: string;            // display string
  ageMinutes: number;      // for sorting
  attention: Attention;
  attentionScore: number;  // 0-100
  relevance: number;       // 0-100
  priority: Priority;
  category: Category;
  tickers: string[];
}

const items: NewsItem[] = [
  {
    id: 1,
    headline: "Infosys signs ₹4,200 Cr deal with Lufthansa Systems",
    summary: "Multi-year IT services contract spans cloud migration and ops. Margin profile in line with top-tier engagements.",
    matters: "Largest Europe win in 18 months — anchors FY26 deal book.",
    source: "MoneyControl", time: "12 min ago", ageMinutes: 12,
    attention: "full", attentionScore: 92, relevance: 88,
    priority: "high", category: "Earnings", tickers: ["INFY", "TCS"],
  },
  {
    id: 2,
    headline: "RBI keeps repo rate unchanged, stance shifts to neutral",
    summary: "MPC voted 5-1 to hold at 6.50% while signalling room for cuts later this year.",
    matters: "Banks rally on softer guidance — rate-sensitives in focus.",
    source: "Bloomberg", time: "38 min ago", ageMinutes: 38,
    attention: "full", attentionScore: 96, relevance: 94,
    priority: "high", category: "Policy", tickers: ["HDFCBANK", "ICICIBANK", "AXISBANK"],
  },
  {
    id: 3,
    headline: "Tata Motors plans EV-only sub-brand for Q3 launch",
    summary: "Internal note suggests separate dealer network and dedicated battery JV in advanced stages.",
    source: "Reuters", time: "1 hr ago", ageMinutes: 60,
    attention: "partial", attentionScore: 71, relevance: 75,
    priority: "medium", category: "Breaking", tickers: ["TATAMOTORS"],
  },
  {
    id: 4,
    headline: "Sun Pharma USFDA inspection closed with zero observations",
    summary: "Halol facility cleared — removes a major overhang on US generics franchise.",
    matters: "Re-rates the US revenue line; analysts likely to revisit estimates.",
    source: "Mint", time: "2 hr ago", ageMinutes: 120,
    attention: "full", attentionScore: 89, relevance: 82,
    priority: "high", category: "Analyst", tickers: ["SUNPHARMA"],
  },
  {
    id: 5,
    headline: "Crude steady at $84 ahead of OPEC+ meeting",
    summary: "Producers expected to extend voluntary cuts; spread between Brent and WTI narrows.",
    source: "Reuters", time: "3 hr ago", ageMinutes: 180,
    attention: "neutral", attentionScore: 42, relevance: 55,
    priority: "low", category: "Commodities", tickers: ["RELIANCE", "ONGC"],
  },
  {
    id: 6,
    headline: "Adani Ports volume hits new monthly record at Mundra",
    summary: "Container throughput up 14% YoY; coal handling lower on inventory normalization.",
    source: "ET Markets", time: "5 hr ago", ageMinutes: 300,
    attention: "partial", attentionScore: 64, relevance: 60,
    priority: "medium", category: "Breaking", tickers: ["ADANIPORTS"],
  },
  {
    id: 7,
    headline: "FIIs net buyers of ₹3,140 Cr Indian equities on Monday",
    summary: "Largest single-day inflow in 6 weeks; DIIs also positive at ₹1,820 Cr.",
    source: "NSDL", time: "6 hr ago", ageMinutes: 360,
    attention: "partial", attentionScore: 68, relevance: 72,
    priority: "medium", category: "FII/DII", tickers: ["NIFTY", "BANKNIFTY"],
  },
  {
    id: 8,
    headline: "Swiggy IPO subscribed 3.6x on final day",
    summary: "QIB portion 6x covered; retail 1.1x. Listing expected next week.",
    source: "BSE", time: "8 hr ago", ageMinutes: 480,
    attention: "full", attentionScore: 84, relevance: 70,
    priority: "high", category: "IPO", tickers: ["SWIGGY"],
  },
  {
    id: 9,
    headline: "UltraTech Cement to acquire India Cements stake",
    summary: "Open offer triggered for additional 26%; deal value pegged near ₹7,000 Cr.",
    matters: "Consolidates south-India cement leadership — pricing power +ve.",
    source: "Bloomberg", time: "10 hr ago", ageMinutes: 600,
    attention: "full", attentionScore: 90, relevance: 86,
    priority: "high", category: "M&A", tickers: ["ULTRACEMCO", "INDIACEM"],
  },
];

const allCategories: ("All" | Category)[] = [
  "All", "Breaking", "Earnings", "Macro", "Policy", "Analyst", "Commodities", "FII/DII", "M&A", "IPO",
];
const priorities: { id: "all" | Priority; label: string }[] = [
  { id: "all", label: "All" },
  { id: "high", label: "High Priority" },
  { id: "medium", label: "Medium Priority" },
  { id: "low", label: "Low Priority" },
];
const tickerUniverse = Array.from(new Set(items.flatMap((i) => i.tickers)));

const attentionMeta: Record<Attention, { label: string; icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  full: { label: "Full Attention", icon: Flame, cls: "attention-full" },
  partial: { label: "Partial Attention", icon: Zap, cls: "attention-partial" },
  neutral: { label: "Neutral", icon: Circle, cls: "attention-neutral" },
};

const priorityDot: Record<Priority, string> = {
  high: "bg-[hsl(38,95%,60%)]",
  medium: "bg-accent",
  low: "bg-muted-foreground/60",
};

const priorityBorder: Record<Priority, string> = {
  high: "border-l-[3px] border-l-destructive",
  medium: "border-l-[3px] border-l-accent",
  low: "border-l-[3px] border-l-border/60",
};

const priorityHeadline: Record<Priority, string> = {
  high: "font-extrabold text-foreground",
  medium: "font-bold text-foreground/95",
  low: "font-semibold text-foreground/85",
};

const sourceUrl = (n: NewsItem) =>
  `https://www.google.com/search?q=${encodeURIComponent(n.headline + " " + n.source)}`;

const News = () => {
  const [category, setCategory] = useState<"All" | Category>("All");
  const [priority, setPriority] = useState<"all" | Priority>("all");
  const [activeTickers, setActiveTickers] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleTicker = (t: string) =>
    setActiveTickers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const filtered = useMemo(() => {
    let list = items.filter((n) => {
      if (category !== "All" && n.category !== category) return false;
      if (priority !== "all" && n.priority !== priority) return false;
      if (activeTickers.length && !n.tickers.some((t) => activeTickers.includes(t))) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${n.headline} ${n.summary} ${n.tickers.join(" ")} ${n.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "latest") list = [...list].sort((a, b) => a.ageMinutes - b.ageMinutes);
    if (sort === "attention") list = [...list].sort((a, b) => b.attentionScore - a.attentionScore);
    if (sort === "relevant") list = [...list].sort((a, b) => b.relevance - a.relevance);
    return list;
  }, [category, priority, activeTickers, query, sort]);

  const clearAll = () => {
    setCategory("All"); setPriority("all"); setActiveTickers([]); setQuery(""); setSort("latest");
  };
  const hasFilters = category !== "All" || priority !== "all" || activeTickers.length > 0 || query.trim() !== "";

  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="03 · Newsdesk"
        title={
          <>
            Only the news that <span className="text-highlight">moves your book</span>.
          </>
        }
        description={
          <>
            Filter, sort, and surface what <span className="text-highlight-soft">changes a thesis</span> —
            quietly retire what doesn't.
          </>
        }
        strikeRate={68}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {/* Control bar */}
        <div className="glass-card rounded-2xl p-4 lg:p-5 mb-6 space-y-4">
          {/* Row 1: search + sort + clear */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 flex-1 min-w-[220px]">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ticker, keyword, or sector…"
                className="flex-1 bg-transparent text-[13px] placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 p-1">
              <ArrowDownUp className="h-3 w-3 text-muted-foreground ml-2" />
              {([
                { id: "latest", label: "Latest" },
                { id: "attention", label: "Highest Attention" },
                { id: "relevant", label: "Most Relevant" },
              ] as { id: SortKey; label: string }[]).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all",
                    sort === s.id
                      ? "bg-accent/15 text-foreground ring-1 ring-accent/40"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {hasFilters && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          {/* Row 2: categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {allCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all hover:-translate-y-px",
                  category === c
                    ? "border-accent/50 bg-accent/15 text-foreground shadow-[0_0_18px_-6px_hsl(var(--accent)/0.6)]"
                    : "border-border/60 bg-background/30 text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Row 3: priority + tickers */}
          <div className="grid gap-3 lg:grid-cols-[auto,1fr] lg:items-center">
            <div className="flex flex-wrap gap-1.5">
              {priorities.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriority(p.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    priority === p.id
                      ? "border-accent/40 bg-accent/10 text-foreground"
                      : "border-border/60 bg-background/30 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p.id !== "all" && <span className={cn("h-1.5 w-1.5 rounded-full", priorityDot[p.id as Priority])} />}
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pl-4 lg:border-l lg:border-border/40">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">Tickers</span>
              <div className="flex gap-1.5">
                {tickerUniverse.map((t) => {
                  const active = activeTickers.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTicker(t)}
                      className={cn(
                        "rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide transition-all shrink-0",
                        active
                          ? "border-primary/50 bg-primary/15 text-primary"
                          : "border-border/60 bg-secondary/40 text-foreground/75 hover:text-foreground hover:border-border",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{filtered.length} stories · sorted by {sort === "latest" ? "time" : sort === "attention" ? "attention" : "relevance"}</span>
          <span className="text-highlight-soft">Live feed</span>
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="glass-card rounded-2xl p-10 text-center text-sm text-muted-foreground">
              No stories match these filters. <button onClick={clearAll} className="text-highlight underline-offset-4 hover:underline">Reset</button>
            </div>
          )}
          {filtered.map((n, i) => {
            const m = attentionMeta[n.attention];
            const Icon = m.icon;
            const isOpen = expandedId === n.id;
            return (
              <article
                key={n.id}
                onClick={() => setExpandedId(isOpen ? null : n.id)}
                className={cn(
                  "group glass-card glass-card-hover rounded-2xl p-5 lg:p-6 animate-fade-in cursor-pointer",
                  priorityBorder[n.priority],
                  isOpen && "is-active-glow",
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", m.cls)}>
                        <Icon className="h-2.5 w-2.5" />
                        {m.label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full", priorityDot[n.priority])} />
                        {n.category}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {n.source} · {n.time}
                      </span>
                    </div>

                    <h3 className={cn("font-display text-[19px] leading-snug tracking-tight", priorityHeadline[n.priority])}>
                      {n.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.summary}</p>

                    {n.matters && (
                      <p className="mt-3 text-[13px] leading-relaxed">
                        <span className="text-highlight">Why it matters.</span>{" "}
                        <span className="text-foreground/85">{n.matters}</span>
                      </p>
                    )}
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0 pl-4 border-l border-border/40">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Impacted</span>
                    <div className="flex flex-wrap justify-end items-center gap-1.5 max-w-[200px]">
                      {n.tickers.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-foreground/85 transition-colors group-hover:border-accent/40 group-hover:text-foreground">
                          {t}
                          <WatchlistButton
                            item={{ ticker: t, news: [{ headline: n.headline, time: n.time }], hasUpdate: true }}
                            size="sm"
                            className="!h-4 !w-4 border-0 bg-transparent ml-0.5"
                          />
                        </span>
                      ))}
                    </div>
                    <ChevronDown className={cn("h-3.5 w-3.5 mt-2 text-muted-foreground transition-transform", isOpen && "rotate-180 text-accent")} />
                  </div>
                </div>

                <div className="mt-3 flex md:hidden flex-wrap gap-1.5 pt-3 border-t border-border/40">
                  {n.tickers.map((t) => (
                    <span key={t} className="rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-foreground/85">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Expandable detail */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-border/40 pt-4 space-y-3">
                      <p className="text-[13px] leading-relaxed text-foreground/85">
                        {n.summary} {n.matters}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                        <span><span className="text-foreground/60">Source ·</span> <span className="text-foreground/90">{n.source}</span></span>
                        <span><span className="text-foreground/60">Posted ·</span> <span className="text-foreground/90">{n.time}</span></span>
                        <span><span className="text-foreground/60">Category ·</span> <span className="text-foreground/90">{n.category}</span></span>
                      </div>
                      <a
                        href={sourceUrl(n)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3B82F6] hover:underline underline-offset-4 transition-all hover:[text-shadow:0_0_8px_hsl(217_91%_60%/0.5)]"
                      >
                        Read Full Article
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};

export default News;
