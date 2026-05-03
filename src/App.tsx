import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Results from "./pages/Results.tsx";
import ResultDetail from "./pages/ResultDetail.tsx";
import StrikeMetrics from "./pages/StrikeMetrics.tsx";
import News from "./pages/News.tsx";
import Ratings from "./pages/Ratings.tsx";
import Orders from "./pages/Orders.tsx";
import Watchlist from "./pages/Watchlist.tsx";
import Alerts from "./pages/Alerts.tsx";
import AmbientBackground from "./components/AmbientBackground";
import { WatchlistProvider } from "./hooks/useWatchlist";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WatchlistProvider>
        <AmbientBackground />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/results" element={<Results />} />
            <Route path="/results/:id" element={<ResultDetail />} />
            <Route path="/strike-metrics" element={<StrikeMetrics />} />
            <Route path="/news" element={<News />} />
            <Route path="/ratings" element={<Ratings />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/alerts" element={<Alerts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WatchlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
