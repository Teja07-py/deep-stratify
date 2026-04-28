import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Search, X, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Static stock universe — can be swapped with an API call later.
const STOCK_UNIVERSE = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy" },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT" },
  { symbol: "INFY", name: "Infosys", sector: "IT" },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking" },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking" },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking" },
  { symbol: "ITC", name: "ITC Limited", sector: "FMCG" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", sector: "Pharma" },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories", sector: "Pharma" },
  { symbol: "MARUTI", name: "Maruti Suzuki", sector: "Auto" },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infra" },
  { symbol: "ADANIENT", name: "Adani Enterprises", sector: "Infra" },
  { symbol: "WIPRO", name: "Wipro", sector: "IT" },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking" },
  { symbol: "TATASTEEL", name: "Tata Steel", sector: "Metals" },
];

const RECENT_KEY = "alphastrike:recent-searches";
const MAX_RECENT = 5;

type Stock = (typeof STOCK_UNIVERSE)[number];

const highlight = (text: string, query: string) => {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-accent/25 text-foreground rounded-sm px-0.5">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
};

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  // Debounce raw -> query (300ms)
  useEffect(() => {
    if (!raw.trim()) {
      setQuery("");
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      setQuery(raw.trim());
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [raw]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo<Stock[]>(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return STOCK_UNIVERSE.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  // Reset active index when results change
  useEffect(() => setActive(0), [results.length, query]);

  const persistRecent = (sym: string) => {
    const next = [sym, ...recent.filter((r) => r !== sym)].slice(0, MAX_RECENT);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const select = useCallback(
    (s: Stock) => {
      persistRecent(s.symbol);
      setRaw(s.symbol);
      setOpen(false);
      inputRef.current?.blur();
      // Hook for navigation / detail view
      // navigate(`/stock/${s.symbol}`)
    },
    [recent],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      select(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = open && (raw.trim().length > 0 || recent.length > 0);

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <div
        className={cn(
          "flex items-center h-9 rounded-full bg-card/60 ring-1 ring-border/60 transition-all duration-200",
          open ? "w-64 ring-accent/40" : "w-9 hover:bg-card",
        )}
      >
        <button
          type="button"
          aria-label="Search"
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {loading ? (
            <Loader2 className="h-[15px] w-[15px] animate-spin" />
          ) : (
            <Search className="h-[15px] w-[15px]" />
          )}
        </button>
        {open && (
          <>
            <input
              ref={inputRef}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search stocks, sectors…"
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none pr-2"
            />
            {raw && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setRaw("");
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="flex h-9 w-7 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-[14px] w-[14px]" />
              </button>
            )}
          </>
        )}
      </div>

      {showDropdown && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[340px] overflow-hidden rounded-xl border border-border/60 bg-popover/95 backdrop-blur-xl shadow-2xl animate-fade-in">
          {/* Recent */}
          {!raw.trim() && recent.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent
              </div>
              {recent.map((sym) => {
                const s = STOCK_UNIVERSE.find((x) => x.symbol === sym);
                if (!s) return null;
                return (
                  <button
                    key={sym}
                    onClick={() => select(s)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] hover:bg-accent/10"
                  >
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{s.symbol}</span>
                    <span className="text-muted-foreground truncate">{s.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading */}
          {raw.trim() && loading && (
            <div className="flex items-center gap-2 px-4 py-6 text-[13px] text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching…
            </div>
          )}

          {/* Results */}
          {raw.trim() && !loading && results.length > 0 && (
            <ul className="p-1.5 max-h-[320px] overflow-y-auto">
              {results.map((s, i) => (
                <li key={s.symbol}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => select(s)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left transition-colors",
                      i === active ? "bg-accent/15" : "hover:bg-accent/10",
                    )}
                  >
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-foreground">
                        {highlight(s.symbol, query)}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {highlight(s.name, query)}
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.sector}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Empty */}
          {raw.trim() && !loading && results.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">
              No results found for{" "}
              <span className="text-foreground font-medium">"{raw}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
