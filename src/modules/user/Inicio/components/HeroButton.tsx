import { cn } from "@/lib/utils";

interface HeroButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}

export function HeroButton({ children, variant = "primary", className, onClick }: HeroButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full sm:w-auto font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer overflow-hidden active:scale-[0.96]",
        variant === "primary" && [
          "bg-ember hover:brightness-110 text-char-deep",
          "shadow-[0_4px_20px_color-mix(in_oklch,var(--ember)_30%,transparent)]",
          "hover:shadow-[0_4px_28px_color-mix(in_oklch,var(--ember)_55%,transparent)]",
          "hover:-translate-y-0.5",
        ],
        variant === "secondary" && [
          "bg-card/40 backdrop-blur-md border border-border hover:border-ember/50 text-foreground font-semibold",
          "hover:bg-accent/60 hover:-translate-y-0.5",
        ],
        className
      )}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 pointer-events-none bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer" aria-hidden="true" />
      )}
      <span className="relative flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-0.5">
        {children}
      </span>
    </button>
  );
}