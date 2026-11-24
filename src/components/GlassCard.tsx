import { useCallback, useRef, type ReactNode } from "react";

interface GlassCardProps {
  id?: string;
  as?: "section" | "div" | "header";
  className?: string;
  ariaLabelledBy?: string;
  children: ReactNode;
}

/**
 * Tactile frosted-glass instrument container with:
 * - Subtle SVG fractalNoise film-grain layer (pointer-events: none)
 * - Precision 5px L-corner crosshair ticks
 * - Pointer-tracked specular rim sheen (--mx, --my) on desktop hover devices
 */
export function GlassCard({
  id,
  as = "section",
  className = "",
  ariaLabelledBy,
  children,
}: GlassCardProps) {
  const ref = useRef<HTMLElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`glass-instrument-card ${className}`}
      onPointerMove={handlePointerMove}
    >
      <span className="glass-rim-sheen" aria-hidden="true" />
      <span className="glass-grain-layer" aria-hidden="true" />
      <span className="corner-tick corner-tl" aria-hidden="true" />
      <span className="corner-tick corner-tr" aria-hidden="true" />
      <span className="corner-tick corner-bl" aria-hidden="true" />
      <span className="corner-tick corner-br" aria-hidden="true" />
      <div className="glass-card-inner">{children}</div>
    </Tag>
  );
}
