import { useEffect, useState } from "react";
import { LiquidMetalButton } from "../shaders/liquid-metal-button/LiquidMetalButton";
import type { TokenResult } from "../lib/perplexity";

interface BranchingVisualProps {
  tokens: TokenResult[];
  highlightedIdx: number | null;
  isReplaying: boolean;
  replayStep: number | null;
  onHighlight: (idx: number | null) => void;
  onToggleReplay: () => void;
}

export function BranchingVisual({
  tokens,
  highlightedIdx,
  isReplaying,
  replayStep,
  onHighlight,
  onToggleReplay,
}: BranchingVisualProps) {
  const [hoveredData, setHoveredData] = useState<TokenResult | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 640px)").matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsCompactViewport(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const stepWidth = 122;
  const paddingX = 64;
  const totalWidth = Math.max(580, tokens.length * stepWidth + paddingX * 2);
  const height = 166;
  const centerY = 78;

  const activeToken =
    highlightedIdx !== null && tokens[highlightedIdx]
      ? tokens[highlightedIdx]
      : hoveredData;

  let spinePath = tokens.length > 0 ? `M ${paddingX} ${centerY}` : "";
  for (let i = 1; i < tokens.length; i++) {
    const x = paddingX + i * stepWidth;
    spinePath += ` L ${x} ${centerY}`;
  }

  return (
    <div className="branching-card">
      <div className="branching-header">
        <div className="branching-title-group">
          <div className="branching-title-row">
            <span className="branching-title">Branching Path</span>
            {isReplaying && replayStep !== null && tokens[replayStep] ? (
              <span className="replay-telemetry-pill" aria-live="polite">
                Step {replayStep + 1}/{tokens.length} · {tokens[replayStep].displayToken} · P=
                {(tokens[replayStep].prob * 100).toFixed(1)}%
              </span>
            ) : null}
          </div>
          <p className="panel-desc" style={{ fontSize: "0.8125rem" }}>
            Narrow beams mean the model was confident. Wide fans mean the word was unexpected. Press Play to step through.
          </p>
        </div>

        <div className="branching-controls-cluster">
          <div className="branching-legend">
            <span className="legend-pill">
              <span className="legend-indicator-dot teal" /> Expected (P &ge; 0.15)
            </span>
            <span className="legend-pill">
              <span className="legend-indicator-dot terracotta" /> Surprising (P &le; 0.05)
            </span>
          </div>

          <div
            className={`threeui-btn-mount threeui-btn-mount--play ${isReplaying ? "is-replaying" : ""}`}
            title={isReplaying ? "Stop sequence step-through replay" : "Play sequence step-through replay"}
          >
            <LiquidMetalButton
              variant="play"
              rendering="colored"
              diameter={isCompactViewport ? 76 : 88}
              strokeWidth={3.0}
              text={isReplaying ? "Stop" : "Play"}
              onClick={onToggleReplay}
            />
          </div>
        </div>
      </div>

      {/* Interactive hover readout pill inside canvas well */}
      <div className="visual-svg-wrapper">
        {activeToken ? (
          <div className="diagram-tooltip-bar" aria-live="polite">
            <span className="dt-token">{activeToken.displayToken}</span>
            <span>P = {activeToken.prob < 0.0001 ? activeToken.prob.toExponential(2) : activeToken.prob.toFixed(4)}</span>
            <span>1/P = {activeToken.invProb.toFixed(2)}</span>
            <span>−ln P = {(-Math.log(activeToken.prob)).toFixed(2)} nats</span>
          </div>
        ) : (
          <div className="diagram-tooltip-bar is-idle">
            <span>Hover a node or press Play to trace token-by-token branching entropy</span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${totalWidth} ${height}`}
          width="100%"
          height={height}
          preserveAspectRatio="xMidYMid meet"
          className="branching-svg"
          aria-label="Sequence branching tree"
        >
          {spinePath ? (
            <path
              d={spinePath}
              stroke="var(--border-stone)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              fill="none"
              opacity="0.7"
            />
          ) : null}

          {tokens.map((item, i) => {
            const x = paddingX + i * stepWidth;
            const isSurprise = item.prob < 0.05;
            const isHighProb = item.prob >= 0.15;
            const branchColor = isSurprise
              ? "var(--accent-surprise)"
              : isHighProb
                ? "var(--accent-certainty)"
                : "var(--accent-amber)";
            const numRays = isSurprise ? 7 : isHighProb ? 2 : 4;
            const spread = isSurprise ? 44 : isHighProb ? 14 : 26;
            const isHighlighted = highlightedIdx === i;

            const rays = [];
            if (i < tokens.length - 1) {
              const nextX = x + stepWidth;
              for (let r = 0; r < numRays; r++) {
                const offsetAngle = (r / (numRays - 1 || 1) - 0.5) * spread;
                const targetY = centerY + offsetAngle;
                const isCenterRay = r === Math.floor(numRays / 2);
                const opacity = isHighlighted ? 1 : isCenterRay ? 0.9 : 0.35;
                const strokeW = isHighlighted ? (isCenterRay ? 2.5 : 1.75) : isCenterRay ? 1.5 : 1;
                rays.push(
                  <line
                    key={`ray-${i}-${r}`}
                    x1={x}
                    y1={centerY}
                    x2={nextX}
                    y2={targetY}
                    stroke={branchColor}
                    strokeWidth={strokeW}
                    strokeOpacity={opacity}
                    className={`branch-ray ${isHighlighted ? "is-highlighted" : ""}`}
                  />,
                );
              }
            }

            const negLogP = (-Math.log(item.prob)).toFixed(2);
            return (
              <g key={`node-${item.pos}-${i}`}>
                {rays}
                <g
                  className={`node-group ${isHighlighted ? "is-highlighted" : ""}`}
                  onMouseEnter={() => {
                    setHoveredData(item);
                    onHighlight(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredData(null);
                    if (!isReplaying) onHighlight(null);
                  }}
                  onClick={() => onHighlight(i)}
                >
                  <title>
                    {`${item.displayToken} | P = ${(item.prob * 100).toFixed(1)}% | 1/P = ${item.invProb.toFixed(2)} | −ln(P) = ${negLogP} nats`}
                  </title>
                  {isHighlighted ? (
                    <circle
                      cx={x}
                      cy={centerY}
                      r="13"
                      fill="none"
                      stroke={branchColor}
                      strokeWidth="1.5"
                      strokeOpacity="0.45"
                    />
                  ) : null}
                  <circle
                    cx={x}
                    cy={centerY}
                    r="7.5"
                    fill="var(--bg-well)"
                    stroke={branchColor}
                    strokeWidth={isHighlighted ? 3 : 2}
                  />
                  <circle cx={x} cy={centerY} r="3" fill={branchColor} />
                  <text
                    x={x}
                    y={centerY - 20}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="12"
                    fontWeight="600"
                    fill="var(--text-ink)"
                  >
                    {item.displayToken}
                  </text>
                  <text
                    x={x}
                    y={centerY + 23}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight="500"
                    fill="var(--text-stone)"
                  >
                    P={(item.prob * 100).toFixed(1)}%
                  </text>
                  <text
                    x={x}
                    y={centerY + 36}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight="700"
                    fill={branchColor}
                  >
                    1/P={item.invProb.toFixed(1)}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
