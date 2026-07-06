// src/modules/user/Inicio/components/TiltCard.tsx

"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
  glowColor?: string;
  className?: string;
}

export function TiltCard({ children, delay = 0, inView, glowColor = "rgba(234,179,8,0.25)", className }: TiltCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (innerRef.current) {
      innerRef.current.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(8px)`;
    }
    const imgEl = el.querySelector<HTMLElement>(".tilt-img");
    if (imgEl) {
      imgEl.style.transform = `scale(1.1) translate(${x * -14}px, ${y * -14}px)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (innerRef.current) {
      innerRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
    const imgEl = wrapRef.current?.querySelector<HTMLElement>(".tilt-img");
    if (imgEl) imgEl.style.transform = "scale(1) translate(0, 0)";
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn("relative", inView ? "animate-fade-in-up" : "opacity-0")}
      style={{ animationDelay: `${delay}s` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient glow */}
      <div
        className="absolute -inset-2 rounded-3xl pointer-events-none transition-opacity duration-400"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, ${glowColor} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          zIndex: 0,
        }}
      />

      {/* Card surface */}
      <div
        ref={innerRef}
        className={cn(
          "relative rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-350",
          "bg-card border border-border",
          hovered && "border-ember/35 shadow-[0_30px_70px_rgba(0,0,0,0.6)]",
          !hovered && "shadow-lg",
          className
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}