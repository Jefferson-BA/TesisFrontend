"use client";
import { useEffect, useState, useRef } from "react";

export const formatPrice = (p: number) => 
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 }).format(p);

export const AnimatedPrice = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [d, setD] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const t0 = performance.now();
      const dur = 900;
      let raf: number;
      const step = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        const v = (1 - Math.pow(1 - p, 3)) * value;
        setD(p < 1 ? v : value);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{formatPrice(d)}</span>;
};