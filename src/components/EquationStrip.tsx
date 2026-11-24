import { useState } from "react";
import { formatScientificProduct } from "../lib/perplexity";
import { AnimatedNumber } from "./AnimatedNumber";

interface EquationStripProps {
  rawProduct: number;
  tokenCount: number;
  perplexity: number;
  compact?: boolean;
  onActiveStepChange?: (stepIndex: number | null) => void;
}

/**
 * 3-column horizontal equation strip with a SINGLE shared frosted accent sheen
 * overlay translated via transform (zero extra WebGL contexts).
 */
export function EquationStrip({
  rawProduct,
  tokenCount,
  perplexity,
  compact = false,
  onActiveStepChange,
}: EquationStripProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const { base, exp } = formatScientificProduct(rawProduct);

  const handleEnter = (idx: number) => {
    setActiveStep(idx);
    onActiveStepChange?.(idx);
  };

  const handleLeave = () => {
    setActiveStep(null);
    onActiveStepChange?.(null);
  };

  return (
    <div
      className={`equation-strip ${compact ? "is-compact" : ""}`}
      data-active-step={activeStep ?? "none"}
      onMouseLeave={handleLeave}
    >
      {/* Single shared sliding frosted sheen + highlight clip overlay */}
      <div
        className={`eq-shared-sheen ${activeStep !== null ? "is-visible" : ""}`}
        style={{
          transform: `translate3d(${(activeStep ?? 0) * 100}%, 0, 0)`,
        }}
        aria-hidden="true"
      />

      <button
        type="button"
        className={`eq-step-col ${activeStep === 0 ? "is-focused" : ""}`}
        onMouseEnter={() => handleEnter(0)}
        onFocus={() => handleEnter(0)}
        onBlur={handleLeave}
      >
        <span className="eq-step-label">{compact ? "∏ 1/P" : "01 · Inverse Product"}</span>
        {!compact ? <span className="eq-step-math">∏ (1 / Pᵢ)</span> : null}
        <span className="eq-step-value tabular-nums">
          {tokenCount === 0 ? (
            "—"
          ) : exp !== null ? (
            <>
              {base} × 10<sup>{exp}</sup>
            </>
          ) : (
            base
          )}
        </span>
      </button>

      <button
        type="button"
        className={`eq-step-col ${activeStep === 1 ? "is-focused" : ""}`}
        onMouseEnter={() => handleEnter(1)}
        onFocus={() => handleEnter(1)}
        onBlur={handleLeave}
      >
        <span className="eq-step-label">{compact ? "Length" : "02 · Sequence Length"}</span>
        {!compact ? <span className="eq-step-math">N</span> : null}
        <span className="eq-step-value tabular-nums">
          {compact ? `N = ${tokenCount}` : `N = ${tokenCount} token${tokenCount === 1 ? "" : "s"}`}
        </span>
      </button>

      <button
        type="button"
        className={`eq-step-col ${activeStep === 2 ? "is-focused" : ""}`}
        onMouseEnter={() => handleEnter(2)}
        onFocus={() => handleEnter(2)}
        onBlur={handleLeave}
      >
        <span className="eq-step-label">{compact ? "PPL" : "03 · Geometric Mean"}</span>
        {!compact ? <span className="eq-step-math">exp(mean(−ln P))</span> : null}
        <span className="eq-step-value tabular-nums">
          {tokenCount === 0 ? "—" : <AnimatedNumber value={perplexity} />}
        </span>
      </button>
    </div>
  );
}
