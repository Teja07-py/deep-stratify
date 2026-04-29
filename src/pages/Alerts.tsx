import { TopNav } from "@/components/TopNav";
import { AlertsBoard } from "@/components/AlertsBoard";

const Alerts = () => (
  <div className="min-h-screen bg-background">
    <TopNav />
    <main className="mx-auto max-w-7xl px-6 py-10">
      <AlertsBoard />
    </main>
  </div>
);

export default Alerts;
