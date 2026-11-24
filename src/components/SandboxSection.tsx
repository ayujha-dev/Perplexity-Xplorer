import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SANDBOX_PRESETS,
  computeInverseProductLogSpace,
  computePerplexityLogSpace,
  getIntuitionBadgeInfo,
  getScalePercentage,
  type PresetKey,
  type SimRow,
} from "../lib/perplexity";
import { AnimatedNumber } from "./AnimatedNumber";
import { EquationStrip } from "./EquationStrip";
import { GlassCard } from "./GlassCard";
import { PocketQuestActionButton } from "./PocketQuestActionButton";

const SEGMENT_COLORS = [
  "var(--accent-certainty)",
  "var(--primary-accent)",
  "#6366f1",
  "var(--accent-surprise)",
  "var(--accent-amber)",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
];

function createRowsFromPreset(key: PresetKey): SimRow[] {
  return SANDBOX_PRESETS[key].rows.map((r, i) => ({
    id: `${key}-${i}-${Date.now()}`,
    token: r.token,
    prob: r.prob,
  }));
}

const SANDBOX_INTRO_WORDS =
  "Adjust token probabilities to observe how one low-likelihood word swings the geometric mean across the entire sequence.".split(
    " ",
  );

export function SandboxSection() {
  const [activePreset, setActivePreset] = useState<PresetKey | null>("surprise");
  const [simRows, setSimRows] = useState<SimRow[]>(() => createRowsFromPreset("surprise"));
  const scrubRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = scrubRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const words = el.querySelectorAll<HTMLElement>(".scrub-word");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.22 },
        {
          opacity: 1,
          stagger: 0.025,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 46%",
            scrub: 0.35,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  // Re-measure ScrollTrigger when rows are added/removed
  useEffect(() => {
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 80);
    return () => window.clearTimeout(t);
  }, [simRows.length]);

  const stats = useMemo(() => {
    const validTokens: Array<{ token: string; prob: number; inv: number; surprise: number }> = [];
    for (const row of simRows) {
      const p = parseFloat(row.prob);
      if (!Number.isNaN(p) && p > 0 && p <= 1) {
        validTokens.push({
          token: row.token.trim() || "token",
          prob: p,
          inv: 1 / p,
          surprise: -Math.log(p),
        });
      }
    }

    const probs = validTokens.map((x) => x.prob);
    const invs = validTokens.map((x) => x.inv);
    const perplexity = computePerplexityLogSpace(probs);
    const rawProduct = computeInverseProductLogSpace(invs);
    const totalSurprise = validTokens.reduce((acc, item) => acc + item.surprise, 0);

    return {
      validTokens,
      N: validTokens.length,
      perplexity,
      rawProduct,
      totalSurprise,
      badge: getIntuitionBadgeInfo(perplexity),
      scalePct: getScalePercentage(perplexity),
    };
  }, [simRows]);

  const handlePresetClick = (key: PresetKey) => {
    setActivePreset(key);
    setSimRows(createRowsFromPreset(key));
  };

  const handleTokenChange = (idx: number, val: string) => {
    setActivePreset(null);
    setSimRows((prev) => prev.map((r, i) => (i === idx ? { ...r, token: val } : r)));
  };

  const handleProbChange = (idx: number, val: string) => {
    setActivePreset(null);
    setSimRows((prev) => prev.map((r, i) => (i === idx ? { ...r, prob: val } : r)));
  };

  const handleSliderChange = (idx: number, val: number) => {
    setActivePreset(null);
    setSimRows((prev) => prev.map((r, i) => (i === idx ? { ...r, prob: val.toFixed(3) } : r)));
  };

  const handleDeleteRow = (idx: number) => {
    setActivePreset(null);
    setSimRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddToken = () => {
    setActivePreset(null);
    setSimRows((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${prev.length}`,
        token: `word_${prev.length + 1}`,
        prob: "0.5",
      },
    ]);
  };

  return (
    <GlassCard id="section-simulator" ariaLabelledBy="sec4-title">
      <div className="panel-header-row">
        <div className="panel-title-cluster">
          <h2 className="panel-title" id="sec4-title">
            <span className="section-num">04</span>
            Try It by Hand
          </h2>
          <span className="sim-tag">Interactive Sandbox · Simulated</span>
        </div>
        <p ref={scrubRef} className="panel-desc sandbox-scrub-intro">
          {SANDBOX_INTRO_WORDS.map((word, idx) => (
            <span key={idx} className="scrub-word">
              {word}{" "}
            </span>
          ))}
        </p>
      </div>

      {/* Presets Row */}
      <div className="samples-subrow">
        <div className="samples-pills">
          <span className="samples-label">Presets:</span>
          {(Object.keys(SANDBOX_PRESETS) as PresetKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`btn-pill btn-secondary-pill sheen-pill ${activePreset === key ? "is-selected" : ""}`}
              onClick={() => handlePresetClick(key)}
            >
              <span>{SANDBOX_PRESETS[key].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split Layout on Desktop (7 cols left : 5 cols right) */}
      <div className="sandbox-split-layout">
        <div className="sandbox-left-col">
          <div className="table-container recessed-well">
            <table id="sim-table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "2rem" }}>#</th>
                  <th scope="col" style={{ minWidth: "82px" }}>Token</th>
                  <th scope="col" style={{ minWidth: "122px" }}>Prob &amp; Slider</th>
                  <th scope="col" style={{ minWidth: "56px" }}>1 / P</th>
                  <th scope="col" style={{ width: "2.5rem", textAlign: "center" }}>Del</th>
                </tr>
              </thead>
              <tbody id="sim-table-body">
                {simRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--text-stone)", padding: "1.5rem" }}>
                      No tokens added. Click &ldquo;Add Token&rdquo; or choose a preset above.
                    </td>
                  </tr>
                ) : (
                  simRows.map((row, index) => {
                    const p = parseFloat(row.prob);
                    const isValid = !Number.isNaN(p) && p > 0 && p <= 1;
                    const invP = isValid ? 1 / p : null;

                    return (
                      <tr key={row.id}>
                        <td style={{ color: "var(--text-stone-faint)", fontWeight: 600 }}>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="sim-token-input"
                            aria-label={`Sandbox token ${index + 1} label`}
                            value={row.token}
                            placeholder="Token name"
                            onChange={(e) => handleTokenChange(index, e.target.value)}
                          />
                        </td>
                        <td>
                          <div className="sim-prob-controls">
                            <input
                              type="number"
                              className={`sim-prob-input ${!isValid ? "is-invalid" : ""}`}
                              aria-label={`Sandbox token ${index + 1} probability`}
                              value={row.prob}
                              step="0.01"
                              min="0.0001"
                              max="1"
                              onChange={(e) => handleProbChange(index, e.target.value)}
                            />
                            <input
                              type="range"
                              className="sim-slider"
                              aria-label={`Sandbox token ${index + 1} probability slider`}
                              value={isValid ? p : 0.5}
                              min="0.001"
                              max="1"
                              step="0.001"
                              onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
                            />
                          </div>
                        </td>
                        <td
                          className="tabular-nums"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontWeight: 600,
                            color: isValid && p < 0.05 ? "var(--accent-surprise)" : "var(--text-ink)",
                          }}
                        >
                          {isValid && invP !== null ? (
                            invP.toFixed(2)
                          ) : (
                            <span style={{ color: "var(--accent-surprise)", fontSize: "0.75rem" }}>Invalid</span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="btn-delete-row"
                            title="Remove token"
                            aria-label={`Remove token ${row.token || index + 1}`}
                            onClick={() => handleDeleteRow(index)}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="sandbox-cta-row">
            <PocketQuestActionButton
              eyebrow="MANUAL SANDBOX"
              label="Add Token"
              meta={`N=${simRows.length}`}
              onClick={handleAddToken}
            />
            <span className="sandbox-helper-note">
              Sliders and numbers synchronize reactively in log-space.
            </span>
          </div>
        </div>

        {/* Right: Sticky Live Result & Surprise Breakdown */}
        <div className="sandbox-sticky-panel recessed-well">
          <div className="sandbox-kpi-row">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <span className="kpi-score-label">Simulated Perplexity</span>
              <span className="sandbox-kpi-value" id="sim-ppl-value">
                {stats.N === 0 ? "—" : <AnimatedNumber value={stats.perplexity} />}
              </span>
            </div>
            <span className={`kpi-intuition-badge tone-${stats.badge.tone}`} id="sim-ppl-badge">
              {stats.N === 0 ? "Awaiting input" : stats.badge.text}
            </span>
          </div>

          {/* Mini Intuition Track inside Sandbox */}
          <div className="scale-track-wrap" style={{ height: "8px" }}>
            <div className="scale-segments">
              <div className="scale-segment scale-seg-predictable" />
              <div className="scale-segment scale-seg-natural" />
              <div className="scale-segment scale-seg-odd" />
              <div className="scale-segment scale-seg-surprising" />
            </div>
            <div
              className="scale-needle-marker"
              style={{ left: `${stats.N === 0 ? 2 : stats.scalePct}%`, height: "14px", top: "-3px" }}
            />
          </div>

          <EquationStrip
            rawProduct={stats.rawProduct}
            tokenCount={stats.N}
            perplexity={stats.perplexity}
            compact
          />

          {/* Segmented Surprise Share Bar (-ln P) */}
          <div className="surprise-share-section">
            <div className="surprise-share-header">
              <span>Surprise Share (−ln P)</span>
              <span className="tabular-nums">Total: {stats.totalSurprise.toFixed(2)} nats</span>
            </div>
            <div className="segmented-bar" id="sim-segmented-bar">
              {stats.validTokens.map((item, idx) => {
                const share =
                  stats.totalSurprise > 0
                    ? (item.surprise / stats.totalSurprise) * 100
                    : 100 / Math.max(1, stats.N);
                const color = SEGMENT_COLORS[idx % SEGMENT_COLORS.length];
                return (
                  <div
                    key={`seg-${idx}-${item.token}`}
                    className="bar-segment"
                    style={{
                      width: `${share}%`,
                      background: color,
                    }}
                    title={`${item.token}: ${share.toFixed(1)}% of total surprise`}
                  />
                );
              })}
            </div>
            <div className="surprise-legend-grid" id="sim-surprise-legend">
              {stats.N === 0 ? (
                <span style={{ color: "var(--text-stone-faint)" }}>
                  Add valid probabilities between 0.001 and 1.0
                </span>
              ) : (
                stats.validTokens.map((item, idx) => {
                  const share =
                    stats.totalSurprise > 0
                      ? (item.surprise / stats.totalSurprise) * 100
                      : 100 / Math.max(1, stats.N);
                  const color = SEGMENT_COLORS[idx % SEGMENT_COLORS.length];
                  return (
                    <div key={`leg-${idx}-${item.token}`} className="surprise-legend-item">
                      <span className="token-name">
                        <span className="token-color-dot" style={{ background: color }} />
                        <span>{item.token}</span>
                        <span className="token-prob-inline">(P={item.prob})</span>
                      </span>
                      <span className="share-pct tabular-nums">{share.toFixed(1)}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
