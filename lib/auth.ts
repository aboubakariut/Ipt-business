import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { limiterDebit, recupererIp } from "./rate-limit";

// Message volontairement identique dans tous les cas d'échec de connexion,
// pour ne jamais révéler si un email est associé à un compte existant
// (protection contre l'énumération de comptes).
const MESSAGE_ERREUR_GENERIQUE = "Email ou mot de passe incorrect";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.motDePasse) {
          throw new Error(MESSAGE_ERREUR_GENERIQUE);
        }

        const emailNormalise = credentials.email.toLowerCase().trim();

        // Limite anti brute-force : par IP ET par email ciblé, pour bloquer
        // aussi bien le "spray" sur beaucoup de comptes que l'acharnement
        // sur un seul compte depuis plusieurs IP.
        const ip = recupererIp(req as any);
        const autoriseParIp = limiterDebit(`login:ip:${ip}`, 10, 10 * 60 * 1000);
        const autoriseParEmail = limiterDebit(`login:email:${emailNormalise}`, 5, 10 * 60 * 1000);

        if (!autoriseParIp || !autoriseParEmail) {
          throw new Error("Trop de tentatives, réessaie dans quelques minutes");
        }

        const user = await prisma.user.findUnique({
          where: { email: emailNormalise }
        });

        // On calcule toujours le bcrypt.compare, même si l'utilisateur n'existe
        // pas, avec un hash factice : ça évite qu'un attaquant distingue les
        // deux cas via le temps de réponse (timing attack).
        const hashComparaison =
          user?.motDePasseHash ?? "$2a$10$CwTycUXWue0Thq9StjUM0uJ8Q6VJXhLm7C6zqNwZzO6dnCkGrO8Xy";
        const motDePasseValide = await bcrypt.compare(credentials.motDePasse, hashComparaison);

        if (!user || !motDePasseValide) {
          throw new Error(MESSAGE_ERREUR_GENERIQUE);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nomComplet,
          plan: user.plan,
          slugBoutique: user.slugBoutique
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = user.plan;
        token.slugBoutique = user.slugBoutique;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.plan = token.plan;
      session.user.slugBoutique = token.slugBoutique;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
