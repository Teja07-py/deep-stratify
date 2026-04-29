import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export interface WatchlistItem {
  ticker: string;
  name?: string;
  price?: number;
  change?: number;        // % change
  metric?: string | number; // strike rate / rating
  metricLabel?: string;
  addedAt: number;
  hasUpdate?: boolean;
  news?: { headline: string; time: string }[];
}

interface WatchlistContextValue {
  items: WatchlistItem[];
  has: (ticker: string) => boolean;
  add: (item: Omit<WatchlistItem, "addedAt">) => void;
  remove: (ticker: string) => void;
  toggle: (item: Omit<WatchlistItem, "addedAt">) => void;
  clearUpdate: (ticker: string) => void;
}

const STORAGE_KEY = "trackit_watchlist_v1";
const Ctx = createContext<WatchlistContextValue | null>(null);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WatchlistItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as WatchlistItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const has = useCallback((ticker: string) => items.some((i) => i.ticker === ticker), [items]);

  const add = useCallback((item: Omit<WatchlistItem, "addedAt">) => {
    setItems((prev) => (prev.some((p) => p.ticker === item.ticker) ? prev : [...prev, { ...item, addedAt: Date.now() }]));
  }, []);

  const remove = useCallback((ticker: string) => {
    setItems((prev) => prev.filter((p) => p.ticker !== ticker));
  }, []);

  const toggle = useCallback((item: Omit<WatchlistItem, "addedAt">) => {
    setItems((prev) =>
      prev.some((p) => p.ticker === item.ticker)
        ? prev.filter((p) => p.ticker !== item.ticker)
        : [...prev, { ...item, addedAt: Date.now() }],
    );
  }, []);

  const clearUpdate = useCallback((ticker: string) => {
    setItems((prev) => prev.map((p) => (p.ticker === ticker ? { ...p, hasUpdate: false } : p)));
  }, []);

  const value = useMemo(() => ({ items, has, add, remove, toggle, clearUpdate }), [items, has, add, remove, toggle, clearUpdate]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useWatchlist = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
};
