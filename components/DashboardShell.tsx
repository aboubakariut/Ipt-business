import { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-muted max-w-[480px] mx-auto relative">
      <main className="pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
