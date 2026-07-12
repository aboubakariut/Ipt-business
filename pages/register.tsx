import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "../components/Button";
import Input from "../components/Input";
import { cn } from "../lib/utils";

const SECTEURS = [
  { valeur: "COMMERCANT", label: "Commerçant" },
  { valeur: "ARTISAN", label: "Artisan" },
  { valeur: "FREELANCE", label: "Freelance" },
  { valeur: "ETUDIANT", label: "Étudiant" },
  { valeur: "PME", label: "PME" }
] as const;

export default function PageInscription() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomComplet: "",
    email: "",
    telephone: "",
    motDePasse: "",
    secteur: "COMMERCANT" as (typeof SECTEURS)[number]["valeur"]
  });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function gererInscription(e: FormEvent) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const reponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.erreur || "Une erreur est survenue");
        setChargement(false);
        return;
      }

      const resultat = await signIn("credentials", {
        email: form.email,
        motDePasse: form.motDePasse,
        redirect: false
      });

      setChargement(false);

      if (resultat?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
    } catch {
      setErreur("Impossible de créer le compte, vérifie ta connexion");
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-6 py-10 max-w-[480px] mx-auto">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-orange mx-auto mb-4 flex items-center justify-center">
          <span className="text-white font-display font-extrabold text-2xl">IPT</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-text-primary">Crée ton compte</h1>
        <p className="text-text-secondary text-[14px] mt-1">Gratuit, sans engagement</p>
      </div>

      <form onSubmit={gererInscription} className="flex flex-col gap-4">
        <Input
          id="nomComplet"
          label="Nom complet"
          placeholder="Aboubakar Sacko"
          value={form.nomComplet}
          onChange={(e) => setForm({ ...form, nomComplet: e.target.value })}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="toi@exemple.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          id="telephone"
          label="Téléphone"
          type="tel"
          placeholder="+223 70 00 00 00"
          value={form.telephone}
          onChange={(e) => setForm({ ...form, telephone: e.target.value })}
          required
        />
        <Input
          id="motDePasse"
          label="Mot de passe"
          type="password"
          placeholder="6 caractères minimum"
          minLength={6}
          value={form.motDePasse}
          onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-text-primary">Ton activité</label>
          <div className="flex flex-wrap gap-2">
            {SECTEURS.map((secteur) => (
              <button
                key={secteur.valeur}
                type="button"
                onClick={() => setForm({ ...form, secteur: secteur.valeur })}
                className={cn(
                  "px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-colors",
                  form.secteur === secteur.valeur
                    ? "bg-brand-orange text-white border-brand-orange"
                    : "bg-white text-text-secondary border-black/10"
                )}
              >
                {secteur.label}
              </button>
            ))}
          </div>
        </div>

        {erreur && (
          <p className="text-[13px] text-state-danger font-medium bg-state-danger/10 rounded-xl px-3 py-2">
            {erreur}
          </p>
        )}

        <Button type="submit" chargement={chargement} className="w-full mt-2">
          Créer mon compte
        </Button>
      </form>

      <p className="text-center text-[13px] text-text-secondary mt-6">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-brand-orange font-bold">
          Connecte-toi
        </Link>
      </p>
    </div>
  );
}
