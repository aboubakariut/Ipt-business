import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface BoutonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primaire" | "secondaire" | "discret" | "danger";
  taille?: "sm" | "md" | "lg";
  chargement?: boolean;
}

const Button = forwardRef<HTMLButtonElement, BoutonProps>(
  ({ className, variante = "primaire", taille = "md", chargement, disabled, children, ...props }, ref) => {
    const variantes = {
      primaire: "bg-brand-orange text-white hover:bg-brand-orange-light shadow-fab",
      secondaire: "bg-brand-teal text-white hover:opacity-90",
      discret: "bg-surface-muted text-text-primary hover:bg-black/5",
      danger: "bg-state-danger text-white hover:opacity-90"
    };

    const tailles = {
      sm: "text-[13px] px-3.5 py-2",
      md: "text-[14px] px-5 py-3",
      lg: "text-[15px] px-6 py-3.5"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || chargement}
        className={cn(
          "font-display font-bold rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
          variantes[variante],
          tailles[taille],
          className
        )}
        {...props}
      >
        {chargement && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
