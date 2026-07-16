import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { genererSlug } from "../../../lib/utils";
import { limiterDebit, recupererIp } from "../../../lib/rate-limit";

const schemaInscription = z.object({
  nomComplet: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  motDePasse: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  secteur: z.enum(["COMMERCANT", "ARTISAN", "FREELANCE", "ETUDIANT", "PME"])
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ erreur: "Méthode non autorisée" });
  }

  // Anti-abus : limite le nombre de créations de compte par IP.
  const ip = recupererIp(req);
  if (!limiterDebit(`register:ip:${ip}`, 5, 60 * 60 * 1000)) {
    return res.status(429).json({ erreur: "Trop de tentatives, réessaie plus tard" });
  }

  try {
    const donnees = schemaInscription.parse(req.body);
    const emailNormalise = donnees.email.toLowerCase().trim();

    const utilisateurExistant = await prisma.user.findUnique({
      where: { email: emailNormalise }
    });

    if (utilisateurExistant) {
      return res.status(409).json({ erreur: "Un compte existe déjà avec cet email" });
    }

    let slugBase = genererSlug(donnees.nomComplet);
    if (!slugBase) slugBase = "boutique";
    let slugFinal = slugBase;
    let compteur = 1;
    while (await prisma.user.findUnique({ where: { slugBoutique: slugFinal } })) {
      slugFinal = `${slugBase}-${compteur}`;
      compteur++;
    }

    const motDePasseHash = await bcrypt.hash(donnees.motDePasse, 10);

    const nouvelUtilisateur = await prisma.user.create({
      data: {
        nomComplet: donnees.nomComplet,
        email: emailNormalise,
        telephone: donnees.telephone,
        motDePasseHash,
        secteur: donnees.secteur,
        slugBoutique: slugFinal
      }
    });

    return res.status(201).json({
      message: "Compte créé avec succès",
      userId: nouvelUtilisateur.id
    });
  } catch (erreur) {
    if (erreur instanceof z.ZodError) {
      return res.status(400).json({ erreur: erreur.errors[0].message });
    }

    // Filet de sécurité en cas de double soumission simultanée :
    // la contrainte unique (email ou slugBoutique) peut être violée
    // entre le "findUnique" et le "create" ci-dessus.
    if (erreur instanceof Prisma.PrismaClientKnownRequestError) {
      if (erreur.code === "P2002") {
        return res.status(409).json({ erreur: "Un compte existe déjà avec ces informations" });
      }

      // Table absente = le schéma n'a jamais été poussé vers la base
      // (il manque un `npx prisma db push` côté déploiement).
      if (erreur.code === "P2021" || erreur.code === "P2010") {
        console.error(
          "[BD] Table manquante — as-tu lancé `npx prisma db push` sur la base de production ?",
          erreur
        );
        return res.status(503).json({
          erreur: "La base de données n'est pas encore initialisée (tables manquantes)."
        });
      }
    }

    // Connexion à la base impossible (mauvaise DATABASE_URL, base hors-ligne,
    // certificat SSL requis manquant, etc.)
    if (erreur instanceof Prisma.PrismaClientInitializationError) {
      console.error("[BD] Connexion impossible — vérifie DATABASE_URL:", erreur.message);
      return res.status(503).json({
        erreur: "Impossible de se connecter à la base de données. Réessaie dans un instant."
      });
    }

    console.error("Erreur inscription:", erreur);
    return res.status(500).json({ erreur: "Une erreur est survenue, réessaie plus tard" });
  }
}
