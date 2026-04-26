import { TopNav } from "@/components/TopNav";
import { StockCard, type StockSignal } from "@/components/StockCard";
import { SectorHeatmap } from "@/components/SectorHeatmap";
import { AlertFeed } from "@/components/AlertFeed";
import { WhySignal } from "@/components/WhySignal";
import { PremiumReport } from "@/components/PremiumReport";

const stocks: StockSignal[] = [
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
    ticker: "TATAMOTORS",
    name: "Tata Motors",
    signal: "bullish",
    confidence: 91,
    price: "₹942",
    change: "+3.8%",
    reasons: { earnings: "Beat +12%", insider: "Buying", sentiment: "Very Strong" },
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
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    signal: "bullish",
    confidence: 82,
    price: "₹1,672",
    change: "+1.6%",
    reasons: { earnings: "Inline", insider: "Holding", sentiment: "Positive" },
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
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="animate-fade-in">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-blue mb-2">
                Today · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Top Opportunities <span className="text-muted-foreground font-light">Today</span>
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                AI-curated, conviction-scored. Built for action — not analysis paralysis.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border/60 bg-card/60 px-3 py-1 backdrop-blur-md">
                Updated 3s ago
              </span>
            </div>
          </div>

          {/* Horizontal scroll cards */}
          <div className="-mx-6 overflow-x-auto px-6 pb-4 [scrollbar-width:thin]">
            <div className="flex gap-5">
              {stocks.map((s, i) => (
                <StockCard key={s.ticker} stock={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Why signal + Alert feed */}
        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WhySignal />
            </div>
            <div>
              <AlertFeed />
            </div>
          </div>
        </section>

        {/* Sector heatmap */}
        <SectorHeatmap />

        {/* Premium report */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <PremiumReport />
        </section>

        <footer className="mx-auto max-w-7xl px-6 py-10 text-center text-xs text-muted-foreground border-t border-border/40">
          Alpha Signals · AI intelligence for the modern investor · Not financial advice
        </footer>
      </main>
    </div>
  );
};

export default Index;
