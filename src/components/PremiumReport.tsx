import { ArrowRight, FileText, Sparkles } from "lucide-react";

export const PremiumReport = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-6 lg:p-8 backdrop-blur-xl">
      {/* glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
          <Sparkles className="h-3 w-3 text-accent-blue" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue">Pre-Market Report</span>
        </div>

        <h3 className="text-3xl font-bold lg:text-4xl tracking-tight leading-[1.1]">
          Today's edge, <span className="font-serif italic font-normal text-muted-foreground">delivered before</span> the bell.
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          47 signals analyzed · 12 high-conviction picks · 3 sectors in focus. Crafted by AI, curated for clarity.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
          <Stat label="Signals" value="47" />
          <Stat label="High Conv." value="12" accent />
          <Stat label="Win Rate" value="73%" />
        </div>

        <button className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-bold text-background shadow-[0_8px_24px_-8px_hsl(142_100%_39%/0.5)] transition-all hover:shadow-[0_12px_32px_-8px_hsl(142_100%_39%/0.7)] hover:-translate-y-0.5">
          <FileText className="h-4 w-4" />
          View Full Pre-Market Report
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="rounded-lg border border-border/60 bg-background/40 p-3">
    <div className={`text-xl font-extrabold tabular-nums ${accent ? "text-bull" : "text-foreground"}`}>{value}</div>
    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);
