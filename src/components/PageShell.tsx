import { TopNav } from "./TopNav";

export const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <TopNav />
    <main className="animate-fade-in">{children}</main>
    <footer className="mx-auto max-w-7xl px-6 py-12 border-t border-border/40 mt-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
        <span>
          Trackit <span className="text-highlight-soft">· intelligence for the modern investor</span>
        </span>
        <span>Not financial advice · Past performance ≠ future results</span>
      </div>
    </footer>
  </div>
);
