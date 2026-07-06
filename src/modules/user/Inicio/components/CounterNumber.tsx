"use client";

import { useState, useEffect, useRef } from "react";

interface CounterNumberProps {
  value: number;
  className?: string;
}

export function CounterNumber({ value, className }: CounterNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const duration = 1800;
        const start = performance.now();
        let raf: number;

        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setCount(Math.round(eased * value));
          if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} className={className}>{count}</span>;
}