import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
  fallback?: string;
}

export function AnimatedNumber({
  value,
  decimals = 2,
  className = "",
  fallback = "—",
}: AnimatedNumberProps) {
  const isValid = Number.isFinite(value) && value > 0;
  const [display, setDisplay] = useState<string>(() =>
    isValid ? (value > 1e7 ? value.toExponential(2) : value.toFixed(decimals)) : fallback,
  );
  const tweenValRef = useRef({ v: isValid ? value : 1 });

  useEffect(() => {
    if (!isValid) {
      setDisplay(value === Infinity ? "∞" : fallback);
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || value > 1e7) {
      tweenValRef.current.v = value;
      setDisplay(value > 1e7 ? value.toExponential(2) : value.toFixed(decimals));
      return;
    }

    const tween = gsap.to(tweenValRef.current, {
      v: value,
      duration: 0.24,
      ease: "power2.out",
      onUpdate: () => {
        setDisplay(tweenValRef.current.v.toFixed(decimals));
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, isValid, decimals, fallback]);

  return <span className={`tabular-nums ${className}`}>{display}</span>;
}
