import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFCFA(montant: number | string): string {
  const nombre = typeof montant === "string" ? parseFloat(montant) : montant;
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(nombre) + " FCFA";
}

export function genererNumeroFacture(): string {
  const date = new Date();
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const suffixe = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `FAC-${annee}${mois}-${suffixe}`;
}

export function genererSlug(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
