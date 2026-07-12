import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home, Users, Package, FileText, Plus, X,
  Receipt, UserPlus, PackagePlus, Wallet
} from "lucide-react";
import { cn } from "../lib/utils";

const LIENS_NAV = [
  { href: "/dashboard", label: "Accueil", icone: Home },
  { href: "/clients", label: "Clients", icone: Users },
  { href: "/produits", label: "Produits", icone: Package },
  { href: "/factures", label: "Factures", icone: FileText }
];

const ACTIONS_RAPIDES = [
  { href: "/factures/nouvelle", label: "Facture", icone: Receipt, couleur: "#FF6B35" },
  { href: "/clients/nouveau", label: "Client", icone: UserPlus, couleur: "#0B7B6E" },
  { href: "/produits/nouveau", label: "Produit", icone: PackagePlus, couleur: "#5B5FDE" },
  { href: "/depenses/nouvelle", label: "Dépense", icone: Wallet, couleur: "#D4AF37" }
];

export default function BottomNav() {
  const router = useRouter();
  const [menuOuvert, setMenuOuvert] = useState(false);

  const [avantFAB, apresFAB] = [LIENS_NAV.slice(0, 2), LIENS_NAV.slice(2)];

  return (
    <>
      {menuOuvert && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-end"
          onClick={() => setMenuOuvert(false)}
          role="dialog"
          aria-label="Actions rapides"
        >
          <div
            className="w-full bg-white rounded-t-3xl p-6 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-text-primary text-[16px]">Action rapide</h3>
              <button onClick={() => setMenuOuvert(false)} aria-label="Fermer">
                <X size={20} className="text-text-secondary" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {ACTIONS_RAPIDES.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setMenuOuvert(false)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: action.couleur + "18" }}
                  >
                    <action.icone size={24} color={action.couleur} />
                  </div>
                  <span className="text-[12px] font-semibold text-text-primary text-center">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center z-30 max-w-[480px] mx-auto rounded-t-3xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        {avantFAB.map((lien) => (
          <NavItem key={lien.href} lien={lien} actif={router.pathname === lien.href} />
        ))}

        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setMenuOuvert(true)}
            aria-label="Action rapide"
            className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center shadow-fab -mt-7 border-4 border-surface active:scale-95 transition-transform"
          >
            <Plus size={26} color="white" strokeWidth={2.5} />
          </button>
        </div>

        {apresFAB.map((lien) => (
          <NavItem key={lien.href} lien={lien} actif={router.pathname === lien.href} />
        ))}
      </nav>
    </>
  );
}

function NavItem({
  lien,
  actif
}: {
  lien: { href: string; label: string; icone: typeof Home };
  actif: boolean;
}) {
  const Icone = lien.icone;
  return (
    <Link href={lien.href} className="flex flex-col items-center gap-1 flex-1 py-2">
      <Icone size={22} strokeWidth={actif ? 2.5 : 1.8} className={actif ? "text-brand-orange" : "text-text-muted"} />
      <span className={cn("text-[10px]", actif ? "text-brand-orange font-bold" : "text-text-muted font-medium")}>
        {lien.label}
      </span>
    </Link>
  );
}
