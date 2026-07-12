import { GetServerSideProps } from "next";
import Link from "next/link";
import { Bell, TrendingUp, Users, ShoppingBag, Receipt } from "lucide-react";
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "../lib/prisma";
import { formatFCFA } from "../lib/utils";
import StatCard from "../components/StatCard";
import DashboardShell from "../components/DashboardShell";

interface Activite {
  id: string;
  nom: string;
  detail: string;
  montant: number;
  type: "vente" | "depense";
  dateISO: string;
}

interface PageProps {
  premierNom: string;
  initiale: string;
  plan: "GRATUIT" | "PREMIUM";
  chiffreAffaires: number;
  nombreClients: number;
  nombreVentes: number;
  activites: Activite[];
}

export default function PageTableauDeBord({
  premierNom,
  initiale,
  plan,
  chiffreAffaires,
  nombreClients,
  nombreVentes,
  activites
}: PageProps) {
  return (
    <DashboardShell>
      {/* Bandeau supérieur */}
      <div className="px-5 pt-6 pb-5 bg-gradient-to-br from-brand-orange to-brand-orange-light rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center text-white font-display font-bold text-lg backdrop-blur-sm">
              {initiale}
            </div>
            <div>
              <p className="text-white/80 text-[12px] font-medium">Bonjour 👋</p>
              <p className="text-white font-display font-bold text-[15px]">{premierNom}</p>
            </div>
          </div>
          <Link
            href="/notifications"
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative"
            aria-label="Notifications"
          >
            <Bell size={18} color="white" />
          </Link>
        </div>

        <div className="mt-5 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <p className="text-white/80 text-[12px] font-medium">Chiffre d'affaires — ce mois-ci</p>
          <p className="text-white text-[26px] font-extrabold mt-0.5 font-display">
            {formatFCFA(chiffreAffaires)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={14} color="#D4FFCB" />
            <span className="text-[#D4FFCB] text-[12px] font-semibold">{nombreVentes} vente(s) ce mois-ci</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="px-5 -mt-1">
        <div className="flex gap-3 mt-5">
          <StatCard label="Clients" valeur={String(nombreClients)} icone={Users} accent="#0B7B6E" />
          <StatCard label="Ventes du mois" valeur={String(nombreVentes)} icone={ShoppingBag} accent="#FF6B35" />
        </div>

        <div className="flex items-center justify-between mt-6 mb-3">
          <h3 className="font-display font-bold text-text-primary text-[15px]">Activité récente</h3>
          <Link href="/factures" className="text-brand-orange text-[12px] font-semibold">
            Voir tout
          </Link>
        </div>

        {activites.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-black/5">
            <p className="text-text-secondary text-[13px]">
              Aucune activité pour l'instant. Crée ta première facture avec le bouton + ci-dessous.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {activites.map((activite) => (
              <div
                key={activite.id}
                className="bg-white rounded-2xl p-3.5 flex items-center justify-between border border-black/5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activite.type === "vente" ? "bg-brand-teal/10" : "bg-brand-orange/10"
                    }`}
                  >
                    {activite.type === "vente" ? (
                      <ShoppingBag size={18} color="#0B7B6E" />
                    ) : (
                      <Receipt size={18} color="#FF6B35" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-[13.5px]">{activite.nom}</p>
                    <p className="text-text-secondary text-[11.5px]">{activite.detail}</p>
                  </div>
                </div>
                <span
                  className={`font-bold text-[13px] ${
                    activite.montant >= 0 ? "text-brand-teal" : "text-text-primary"
                  }`}
                >
                  {activite.montant >= 0 ? "+ " : "- "}
                  {formatFCFA(Math.abs(activite.montant))}
                </span>
              </div>
            ))}
          </div>
        )}

        {plan === "GRATUIT" && (
          <Link
            href="/abonnement"
            className="mt-6 bg-gradient-to-r from-brand-ink to-brand-ink-soft rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-white font-display font-bold text-[13.5px]">Passe à Premium ⭐</p>
              <p className="text-white/60 text-[11.5px] mt-0.5">Boutique illimitée, statistiques avancées</p>
            </div>
            <div className="bg-brand-gold text-brand-ink text-[11px] font-extrabold px-3 py-1.5 rounded-full">
              Voir
            </div>
          </Link>
        )}
      </div>
    </DashboardShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const userId = session.user.id;

  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);

  const [utilisateur, nombreClients, facturesDuMois, dernieresFactures, dernieresDepenses] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.client.count({ where: { userId } }),
      prisma.facture.findMany({
        where: { userId, statut: "PAYEE", createdAt: { gte: debutMois } }
      }),
      prisma.facture.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { client: true }
      }),
      prisma.depense.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 2
      })
    ]);

  if (!utilisateur) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const chiffreAffaires = facturesDuMois.reduce((total, f) => total + Number(f.total), 0);
  const nombreVentes = facturesDuMois.length;

  const activites: Activite[] = [
    ...dernieresFactures.map((f) => ({
      id: f.id,
      nom: f.client?.nom ?? "Client",
      detail: `Facture ${f.numero}`,
      montant: Number(f.total),
      type: "vente" as const,
      dateISO: f.createdAt.toISOString()
    })),
    ...dernieresDepenses.map((d) => ({
      id: d.id,
      nom: d.categorie,
      detail: d.note ?? "Dépense",
      montant: -Number(d.montant),
      type: "depense" as const,
      dateISO: d.date.toISOString()
    }))
  ]
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
    .slice(0, 5);

  return {
    props: {
      premierNom: utilisateur.nomComplet.split(" ")[0] ?? "",
      initiale: utilisateur.nomComplet.charAt(0).toUpperCase() || "?",
      plan: utilisateur.plan,
      chiffreAffaires,
      nombreClients,
      nombreVentes,
      activites
    }
  };
};
