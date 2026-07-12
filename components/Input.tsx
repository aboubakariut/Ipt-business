import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  erreur?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, erreur, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[13px] font-semibold text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-2xl border bg-white px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange",
            erreur ? "border-state-danger" : "border-black/10",
            className
          )}
          aria-invalid={!!erreur}
          aria-describedby={erreur ? `${id}-erreur` : undefined}
          {...props}
        />
        {erreur && (
          <p id={`${id}-erreur`} className="text-[12px] text-state-danger font-medium">
            {erreur}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
