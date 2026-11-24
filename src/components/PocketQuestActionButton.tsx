import type { CSSProperties } from "react";

export interface PocketQuestActionButtonProps {
  eyebrow?: string;
  label?: string;
  meta?: string;
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Interactive React adapter for ThreeUI's Pocket Quest CTA Button
 * (`src/shaders/aura-weekly-november-2026/PocketQuestCtaButton.tsx` +
 *  `public/sections/pocket-quest-cta-button/preview.html`), using the exact
 * authored `.pq-round-button` typography (Switzer `.woff2`), geometry,
 * warm tactile stationery palette, and spring-press mechanics while binding
 * cleanly to Perplexity Explorer's interactive sandbox action.
 */
export function PocketQuestActionButton({
  eyebrow = "MANUAL SANDBOX",
  label = "Add Token",
  meta = "+1",
  onClick,
  className = "",
  style,
}: PocketQuestActionButtonProps) {
  return (
    <div className={`threeui-btn-mount threeui-btn-mount--pocket ${className}`} style={style}>
      <button
        type="button"
        className="pq-round-button"
        onClick={onClick}
        aria-label={`${label} (${eyebrow})`}
      >
        <span className="pq-round-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5.5v13M5.5 12h13"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="pq-round-label">
          <small>{eyebrow}</small>
          <strong>{label}</strong>
        </span>
        <span className="pq-round-time" aria-hidden="true">
          {meta}
        </span>
      </button>
    </div>
  );
}
