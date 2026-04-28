import { TopNav } from "@/components/TopNav";
import { TickerTape } from "@/components/TickerTape";
import { MarketStrikeHeader } from "@/components/MarketStrikeHeader";
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

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <TickerTape />

      <main>
        <MarketStrikeHeader
          eyebrow="Pre-market edition"
          title={
            <>
              What to act on, <span className="text-highlight">before the bell</span>.
            </>
          }
          description={
            <>
              Five signals survived our filters this morning — out of{" "}
              <span className="font-semibold text-foreground tabular-nums">2,847</span> tickers scanned.
              Updated 3s ago, refreshing every 60s.
            </>
          }
          strikeRate={68}
        />

        {/* HERO BODY — featured + side rail */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
            <FeaturedStock stock={featured} />

            <aside className="flex flex-col">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Also worth watching
                </h3>
                <a href="#" className="text-xs font-semibold text-highlight hover:underline underline-offset-4">
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

        {/* INSIGHT + ALERTS */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              02 · The reasoning
            </p>
            <h2 className="mt-2 font-display text-[34px] font-extrabold tracking-[-0.025em]">
              <span className="text-highlight">Why</span> the model is convinced.
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
              Trackit <span className="text-highlight-soft">· intelligence for the modern investor</span>
            </span>
            <span>Not financial advice · Past performance ≠ future results</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
