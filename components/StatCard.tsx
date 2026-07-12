import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  valeur: string;
  variation?: string;
  icone?: LucideIcon;
  accent?: string;
}

export default function StatCard({ label, valeur, variation, icone: Icone, accent = "#0B7B6E" }: StatCardProps) {
  return (
    <div className="flex-1 min-w-[140px] bg-surface-card rounded-3xl p-4 shadow-card border border-black/5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-secondary font-medium">{label}</p>
        {Icone && <Icone size={16} color={accent} />}
      </div>
      <p className="text-2xl font-extrabold text-text-primary mt-1 font-display">{valeur}</p>
      {variation && (
        <p className="text-[12px] font-semibold mt-1" style={{ color: accent }}>
          {variation}
        </p>
      )}
    </div>
  );
}
