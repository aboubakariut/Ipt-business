import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "../components/Button";
import Input from "../components/Input";

export default function PageConnexion() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function gererConnexion(e: FormEvent) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const resultat = await signIn("credentials", {
      email,
      motDePasse,
      redirect: false
    });

    setChargement(false);

    if (resultat?.error) {
      setErreur("Email ou mot de passe incorrect");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-6 py-10 max-w-[480px] mx-auto">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-orange mx-auto mb-4 flex items-center justify-center">
          <span className="text-white font-display font-extrabold text-2xl">IPT</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-text-primary">Content de te revoir</h1>
        <p className="text-text-secondary text-[14px] mt-1">Connecte-toi à ton espace IPT Business</p>
      </div>

      <form onSubmit={gererConnexion} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="toi@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="motDePasse"
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />

        {erreur && (
          <p className="text-[13px] text-state-danger font-medium bg-state-danger/10 rounded-xl px-3 py-2">
            {erreur}
          </p>
        )}

        <Button type="submit" chargement={chargement} className="w-full mt-2">
          Se connecter
        </Button>
      </form>

      <p className="text-center text-[13px] text-text-secondary mt-6">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-brand-orange font-bold">
          Crée-le gratuitement
        </Link>
      </p>
    </div>
  );
}
