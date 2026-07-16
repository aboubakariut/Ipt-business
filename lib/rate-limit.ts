// Limiteur de débit simple, en mémoire, best-effort.
//
// ⚠️ Limite connue : sur Vercel serverless, chaque instance a sa propre
// mémoire (pas de store partagé), donc ce n'est pas une protection absolue
// contre un brute-force distribué sur plusieurs instances. C'est une
// première barrière largement suffisante pour dissuader un script naïf ;
// pour une protection robuste en production à plus grande échelle,
// remplace ceci par un store partagé (ex. Upstash Redis + @upstash/ratelimit).

interface Entree {
  compte: number;
  expireLe: number;
}

const compteurs = new Map<string, Entree>();

/**
 * Retourne true si la tentative est autorisée, false si la limite est atteinte.
 *
 * @param cle           Identifiant unique de la cible (ex. "login:1.2.3.4" ou "login:email@x.com")
 * @param maxTentatives Nombre maximum de tentatives autorisées dans la fenêtre
 * @param fenetreMs      Durée de la fenêtre glissante, en millisecondes
 */
export function limiterDebit(cle: string, maxTentatives: number, fenetreMs: number): boolean {
  const maintenant = Date.now();
  const entree = compteurs.get(cle);

  if (!entree || entree.expireLe < maintenant) {
    compteurs.set(cle, { compte: 1, expireLe: maintenant + fenetreMs });
    return true;
  }

  if (entree.compte >= maxTentatives) {
    return false;
  }

  entree.compte++;
  return true;
}

/** Récupère l'IP de la requête, en tenant compte du proxy Vercel. */
export function recupererIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "inconnu";
}

// Nettoyage périodique pour éviter une fuite mémoire sur les instances longue durée.
const intervalle = setInterval(
  () => {
    const maintenant = Date.now();
    for (const [cle, entree] of compteurs) {
      if (entree.expireLe < maintenant) compteurs.delete(cle);
    }
  },
  5 * 60 * 1000
);
intervalle.unref?.();
