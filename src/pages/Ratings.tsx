import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Plus, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
import { cn } from "@/lib/utils";

type Action = "Buy" | "Sell" | "Upgrade" | "Downgrade" | "Initiate" | "Hold";
type Region = "IN" | "US";

interface RatingRow {
  id: number;
  symbol: string;
  region: Region;
  broker: string;
  action: Action;
  rating: string;
  target: number;
  cmp: number;
  commentary: string;
}

const rowsAll: RatingRow[] = [
  { id: 1, symbol: "RELIANCE", region: "IN", broker: "Morgan Stanley", action: "Upgrade", rating: "Overweight", target: 3250, cmp: 2880, commentary: "Retail spin-off catalyst, new energy ramp." },
  { id: 2, symbol: "INFY",     region: "IN", broker: "Jefferies",      action: "Buy",     rating: "Buy",         target: 2050, cmp: 1832, commentary: "Deal momentum strongest in 6 quarters." },
  { id: 3, symbol: "HDFCBANK", region: "IN", broker: "CLSA",           action: "Buy",     rating: "Outperform",  target: 2000, cmp: 1715, commentary: "NIM trough behind; deposit franchise resilient." },
  { id: 4, symbol: "TATAMOTORS", region: "IN", broker: "Nomura",       action: "Downgrade", rating: "Neutral",   target: 920,  cmp: 985,  commentary: "JLR demand softening in EU; mix risk." },
  { id: 5, symbol: "SUNPHARMA", region: "IN", broker: "Macquarie",     action: "Initiate", rating: "Outperform", target: 1980, cmp: 1745, commentary: "Specialty pipeline + USFDA tailwind." },
  { id: 6, symbol: "ULTRACEMCO", region: "IN", broker: "Kotak",        action: "Buy",     rating: "Buy",         target: 12500, cmp: 10840, commentary: "Pricing power post-consolidation." },
  { id: 7, symbol: "AXISBANK", region: "IN", broker: "Citi",           action: "Sell",    rating: "Underweight", target: 1020, cmp: 1140, commentary: "Credit cost normalization underestimated." },
  { id: 8, symbol: "NVDA",     region: "US", broker: "Goldman Sachs",  action: "Buy",     rating: "Conviction Buy", target: 175, cmp: 142, commentary: "Blackwell demand visibility into 2027." },
  { id: 9, symbol: "TSLA",     region: "US", broker: "Wells Fargo",    action: "Downgrade", rating: "Underweight", target: 125, cmp: 178, commentary: "Auto gross margin compression risk." },
  { id: 10, symbol: "AAPL",    region: "US", broker: "Morgan Stanley", action: "Hold",    rating: "Equal-Weight", target: 235, cmp: 228, commentary: "Services stable, hardware cycle muted." },
];

const actionStyle: Record<Action, string> = {
  Buy: "text-bull bg-primary/10 border-primary/30",
  Upgrade: "text-bull bg-primary/10 border-primary/30",
  Initiate: "text-accent bg-accent/10 border-accent/30",
  Hold: "text-muted-foreground bg-muted/30 border-border/60",
  Sell: "text-bear bg-destructive/10 border-destructive/30",
  Downgrade: "text-bear bg-destructive/10 border-destructive/30",
};

const Ratings = () => {
  const [region, setRegion] = useState<Region>("IN");
  const [dayOffset, setDayOffset] = useState(0);

  const rows = useMemo(() => rowsAll.filter((r) => r.region === region), [region]);

  const summary = useMemo(() => {
    const total = rows.length;
    const upgrades = rows.filter((r) => r.action === "Upgrade" || r.action === "Buy").length;
    const downgrades = rows.filter((r) => r.action === "Downgrade" || r.action === "Sell").length;
    const newCov = rows.filter((r) => r.action === "Initiate").length;
    return { total, upgrades, downgrades, newCov };
  }, [rows]);

  const dateLabel = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }, [dayOffset]);

  return (
    <PageShell>
      <MarketStrikeHeader
        eyebrow="04 · Analyst Desk"
        title={
          <>
            Where the street is <span className="text-highlight">placing its conviction</span>.
          </>
        }
        description={
          <>
            Every upgrade, downgrade, and price target — ranked, color-coded, and ready to action.
          </>
        }
        strikeRate={62}
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {/* Top controls */}
        <div className="glass-card rounded-2xl p-4 lg:p-5 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date selector */}
            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/40 p-1">
              <button onClick={() => setDayOffset((d) => d - 1)} className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-card/60">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setDayOffset(0)} className={cn("px-3 py-1 text-[12px] font-semibold rounded-full transition-colors", dayOffset === 0 ? "text-foreground bg-accent/15" : "text-muted-foreground hover:text-foreground")}>
                Today
              </button>
              <span className="px-2 text-[11px] tabular-nums text-muted-foreground">{dateLabel}</span>
              <button onClick={() => setDayOffset((d) => d + 1)} className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-card/60">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Region toggle */}
            <div className="flex items-center gap-0.5 rounded-full border border-border/60 bg-background/40 p-1">
              {(["IN", "US"] as Region[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={cn(
                    "px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all",
                    region === r ? "bg-accent/15 text-foreground ring-1 ring-accent/40" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r === "IN" ? "🇮🇳 India" : "🇺🇸 US"}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Summary chips */}
            <div className="flex flex-wrap items-center gap-2">
              <SummaryChip label="Total Actions" value={summary.total} />
              <SummaryChip label="Upgrades" value={summary.upgrades} tone="bull" icon={<ArrowUpRight className="h-3 w-3" />} />
              <SummaryChip label="Downgrades" value={summary.downgrades} tone="bear" icon={<ArrowDownRight className="h-3 w-3" />} />
              <SummaryChip label="New Coverage" value={summary.newCov} tone="accent" icon={<Plus className="h-3 w-3" />} />
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground border-b border-border/50 bg-background/30">
                  <th className="px-5 py-3 font-semibold">Symbol</th>
                  <th className="px-3 py-3 font-semibold">Broker</th>
                  <th className="px-3 py-3 font-semibold">Action</th>
                  <th className="px-3 py-3 font-semibold">Rating</th>
                  <th className="px-3 py-3 font-semibold text-right">Target</th>
                  <th className="px-3 py-3 font-semibold text-right">CMP</th>
                  <th className="px-3 py-3 font-semibold text-right">Upside</th>
                  <th className="px-5 py-3 font-semibold">Commentary</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const upside = ((r.target - r.cmp) / r.cmp) * 100;
                  const positive = upside >= 0;
                  return (
                    <tr
                      key={r.id}
                      className="group border-b border-border/30 last:border-b-0 transition-colors hover:bg-accent/[0.04] animate-fade-in"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent/20 to-primary/10 text-[10px] font-black tracking-tighter">
                            {r.symbol.slice(0, 2)}
                          </div>
                          <span className="font-display font-bold tracking-tight">{r.symbol}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-foreground/85">{r.broker}</td>
                      <td className="px-3 py-4">
                        <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", actionStyle[r.action])}>
                          {r.action}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-foreground/90 font-medium">{r.rating}</td>
                      <td className="px-3 py-4 text-right tabular-nums font-semibold">
                        {region === "US" ? "$" : "₹"}{r.target.toLocaleString()}
                      </td>
                      <td className="px-3 py-4 text-right tabular-nums text-muted-foreground">
                        {region === "US" ? "$" : "₹"}{r.cmp.toLocaleString()}
                      </td>
                      <td className={cn("px-3 py-4 text-right tabular-nums font-bold", positive ? "text-bull" : "text-bear")}>
                        <span className="inline-flex items-center gap-0.5">
                          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {positive ? "+" : ""}{upside.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-foreground/75 max-w-[280px]">{r.commentary}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

const SummaryChip = ({
  label, value, tone, icon,
}: { label: string; value: number; tone?: "bull" | "bear" | "accent"; icon?: React.ReactNode }) => {
  const tones: Record<string, string> = {
    bull: "text-bull border-primary/30 bg-primary/10",
    bear: "text-bear border-destructive/30 bg-destructive/10",
    accent: "text-accent border-accent/30 bg-accent/10",
  };
  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full border px-3 py-1",
      tone ? tones[tone] : "border-border/60 bg-background/40 text-foreground/85",
    )}>
      {icon}
      <span className="text-[10px] uppercase tracking-[0.18em] opacity-80">{label}</span>
      <span className="num-display text-[15px]">{value}</span>
    </div>
  );
};

export default Ratings;
