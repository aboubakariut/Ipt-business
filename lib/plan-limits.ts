// Toutes les limites du plan Gratuit sont centralisées ici.
// Aucune page ne doit coder une limite en dur : elle doit importer ces constantes.

export const LIMITES_GRATUIT = {
  clients: 40,
  produits: 25,
  facturesParMois: 15,
  boutiques: 1,
  modelesCV: 1,
  modelesFlyer: 2
} as const;

export const PRIX_PREMIUM = {
  particulier: { min: 1500, max: 2000, label: "Particulier / Freelance" },
  commercant: { min: 2500, max: 3500, label: "Commerçant / Artisan" },
  entreprise: { min: 5000, max: 8000, label: "PME / Entreprise" }
} as const;

export type PlanType = "GRATUIT" | "PREMIUM";

export function estAuDelaDeLaLimite(
  plan: PlanType,
  ressource: keyof typeof LIMITES_GRATUIT,
  quantiteActuelle: number
): boolean {
  if (plan === "PREMIUM") return false;
  return quantiteActuelle >= LIMITES_GRATUIT[ressource];
}
