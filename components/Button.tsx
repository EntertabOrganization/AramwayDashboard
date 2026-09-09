import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "danger" | "ghost";

const VARIANT_STYLES: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark border border-primary",
  outline: "bg-white text-ink border border-border hover:border-primary",
  danger: "bg-white text-red-700 border border-red-200 hover:bg-red-50",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-cream-soft",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    />
  );
}
