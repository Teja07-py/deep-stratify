import { TopNav } from "@/components/TopNav";
import { TickerTape } from "@/components/TickerTape";
import { FeaturedStock } from "@/components/FeaturedStock";
import { MiniSignalRow } from "@/components/MiniSignalRow";
import { type StockSignal } from "@/components/StockCard";
import { SectorHeatmap } from "@/components/SectorHeatmap";
import { AlertFeed } from "@/components/AlertFeed";
import { WhySignal } from "@/components/WhySignal";
import { PremiumReport } from "@/components/PremiumReport";

const stocks: StockSignal[] = [
  {
    ticker: "TATAMOTORS",
    name: "Tata Motors",
    signal: "bullish",
    confidence: 91,
    price: "₹942",
    change: "+3.8%",
    reasons: { earnings: "Beat +12%", insider: "Buying", sentiment: "Very Strong" },
  },
  {
    ticker: "INFY",
    name: "Infosys",
    signal: "bullish",
    confidence: 87,
    price: "₹1,847",
    change: "+2.4%",
    reasons: { earnings: "Beat +8.2%", insider: "Buying", sentiment: "Strong" },
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    signal: "bullish",
    confidence: 82,
    price: "₹1,672",
    change: "+1.6%",
    reasons: { earnings: "Inline", insider: "Holding", sentiment: "Positive" },
  },
  {
    ticker: "ADANIPORTS",
    name: "Adani Ports",
    signal: "bearish",
    confidence: 76,
    price: "₹1,284",
    change: "-2.1%",
    reasons: { earnings: "Miss -3.4%", insider: "Selling", sentiment: "Weak" },
  },
  {
    ticker: "RELIANCE",
    name: "Reliance Inds",
    signal: "neutral",
    confidence: 64,
    price: "₹2,945",
    change: "+0.3%",
    reasons: { earnings: "Mixed", insider: "Neutral", sentiment: "Balanced" },
  },
];

const Index = () => {
  const [featured, ...rest] = stocks;
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <TickerTape />

      <main>
        {/* HERO — asymmetric: editorial headline + featured + side rail */}
        <section className="mx-auto max-w-7xl px-6 pt-14 pb-10">
          {/* Editorial header */}
          <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8 animate-fade-in">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-blue">
                {today} · pre-market edition
              </p>
              <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.02] tracking-tight">
                What to act on,{" "}
                <span className="font-serif italic font-normal text-muted-foreground">before</span>{" "}
                the bell.
              </h1>
            </div>
            <div className="md:col-span-4 md:pb-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Five signals survived our filters this morning — out of{" "}
                <span className="text-foreground font-semibold tabular-nums">2,847</span> tickers scanned.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                Updated 3s ago · refreshes every 60s
              </div>
            </div>
          </div>

          {/* Featured + side rail */}
          <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
            <FeaturedStock stock={featured} />

            <aside className="flex flex-col">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Also worth watching
                </h3>
                <a href="#" className="font-serif italic text-xs text-accent-blue hover:underline underline-offset-4">
                  view all →
                </a>
              </div>
              <div className="flex flex-col gap-2.5">
                {rest.map((s, i) => (
                  <MiniSignalRow key={s.ticker} stock={s} index={i} />
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* INSIGHT + ALERTS — 2 columns, asymmetric weight */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              02 · The reasoning
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              <span className="font-serif italic font-normal">Why</span> the model is convinced.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WhySignal />
            </div>
            <div>
              <AlertFeed />
            </div>
          </div>
        </section>

        {/* SECTOR */}
        <div className="mx-auto max-w-7xl px-6 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            03 · Where capital is flowing
          </p>
        </div>
        <SectorHeatmap />

        {/* REPORT */}
        <section className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-3">
            04 · The morning brief
          </p>
          <PremiumReport />
        </section>

        <footer className="mx-auto max-w-7xl px-6 py-12 border-t border-border/40">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
            <span>
              Alpha Signals · <span className="font-serif italic">intelligence for the modern investor</span>
            </span>
            <span>Not financial advice · Past performance ≠ future results</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
