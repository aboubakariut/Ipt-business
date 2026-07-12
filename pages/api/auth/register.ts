import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { genererSlug } from "../../../lib/utils";

const schemaInscription = z.object({
  nomComplet: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  motDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  secteur: z.enum(["COMMERCANT", "ARTISAN", "FREELANCE", "ETUDIANT", "PME"])
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ erreur: "Méthode non autorisée" });
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
    console.error("Erreur inscription:", erreur);
    return res.status(500).json({ erreur: "Une erreur est survenue, réessaie plus tard" });
  }
}
