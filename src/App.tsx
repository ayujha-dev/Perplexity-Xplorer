import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { PredictiveArcCanvas } from "./shaders/predictive-arc/PredictiveArcCollection";
import { LiquidMetalButton } from "./shaders/liquid-metal-button/LiquidMetalButton";
import {
  CACHED_SAMPLE,
  SAMPLE_PROMPTS,
  computeInverseProductLogSpace,
  computePerplexityLogSpace,
  getIntuitionBadgeInfo,
  getScalePercentage,
  runPerplexityInference,
  type ModelStatusState,
  type NextTokenCandidate,
  type TokenResult,
} from "./lib/perplexity";
import { AnimatedNumber } from "./components/AnimatedNumber";
import { BranchingVisual } from "./components/BranchingVisual";
import { EquationStrip } from "./components/EquationStrip";
import { GlassCard } from "./components/GlassCard";
import { PreloaderCurtain } from "./components/PreloaderCurtain";
import { SandboxSection } from "./components/SandboxSection";

gsap.registerPlugin(ScrollTrigger);

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  const urlTheme = new URLSearchParams(window.location.search).get("theme");
  if (urlTheme === "light" || urlTheme === "dark") return urlTheme;
  try {
    const saved = localStorage.getItem("ppx_theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function App() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const isDark = theme === "dark";

  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Inference & Sample State (Preloaded with cached sample, zero empty states)
  const [sentence, setSentence] = useState<string>(CACHED_SAMPLE.sentence);
  const [tokens, setTokens] = useState<TokenResult[]>(CACHED_SAMPLE.tokens);
  const [nextTokens, setNextTokens] = useState<NextTokenCandidate[]>(CACHED_SAMPLE.nextTokens);
  const [isCached, setIsCached] = useState(true);
  const [statusState, setStatusState] = useState<ModelStatusState>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("DistilGPT-2 idle (~82MB)");
  const [isCalculating, setIsCalculating] = useState(false);
  const [swapGeneration, setSwapGeneration] = useState(0);

  // Cross-highlighting & Step-Through Replay State
  const [highlightedIdx, setHighlightedIdx] = useState<number | null>(null);
  const [activeEqStep, setActiveEqStep] = useState<number | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStep, setReplayStep] = useState<number | null>(null);

  const lenisRef = useRef<Lenis | null>(null);
  const appShellRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const tableRowsRef = useRef<HTMLTableSectionElement>(null);
  const predListRef = useRef<HTMLDivElement>(null);

  // Sync theme attribute on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("ppx_theme", theme);
    } catch {
      // ignore
    }
  }, [theme, isDark]);

  // Lenis + GSAP ScrollTrigger Integration + ResizeObserver
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleNativeScroll = () => {
      setIsScrolled(window.scrollY > 48);
    };

    if (reduced) {
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
      handleNativeScroll();
      return () => window.removeEventListener("scroll", handleNativeScroll);
    }

    const lenis = new Lenis({
      lerp: 0.11,
      duration: 0.95,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    if (!preloaderDone) {
      lenis.stop();
    }

    lenis.on("scroll", (e: { scroll: number }) => {
      setIsScrolled(e.scroll > 48);
      ScrollTrigger.update();
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Debounced ResizeObserver for accurate ScrollTrigger bounds
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    });
    if (appShellRef.current) ro.observe(appShellRef.current);

    return () => {
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Unlock Lenis and trigger Hero Staggered Entrance when preloader completes
  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
    lenisRef.current?.start();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll<HTMLElement>(".hero-enter-item");
    if (!targets.length) return;

    if (reduced) {
      gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: "none", clearProps: "opacity" });
      return;
    }

    gsap.fromTo(
      targets,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.28,
        stagger: 0.055,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
  }, []);

  // Subtle fluid metadata swap + GPU micro-bars when tokens or predictions update
  useEffect(() => {
    if (swapGeneration === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const animTargets = document.querySelectorAll<HTMLElement>(".fluid-swap-target");
    if (animTargets.length) {
      gsap.fromTo(
        animTargets,
        { opacity: 0.35, y: 6, filter: "blur(3px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.24,
          stagger: 0.025,
          ease: "power2.out",
          clearProps: "transform,filter,opacity",
        },
      );
    }

    if (predListRef.current) {
      const bars = predListRef.current.querySelectorAll<HTMLElement>(".pred-bar-fill");
      gsap.fromTo(
        bars,
        { scaleX: 0 },
        {
          scaleX: (_i, el) => Number(el.dataset.scale || 0.05),
          duration: 0.32,
          stagger: 0.024,
          ease: "power2.out",
        },
      );
    }
  }, [swapGeneration]);

  // Initial bar scale & Section row activation
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (predListRef.current) {
      const bars = predListRef.current.querySelectorAll<HTMLElement>(".pred-bar-fill");
      bars.forEach((bar) => {
        bar.style.transform = `scaleX(${Number(bar.dataset.scale || 0.05)})`;
      });
    }

    if (reduced) return;

    const ctx = gsap.context(() => {
      if (tableRowsRef.current) {
        const rows = tableRowsRef.current.querySelectorAll("tr");
        gsap.fromTo(
          rows,
          { opacity: 0.35 },
          {
            opacity: 1,
            duration: 0.28,
            stagger: 0.03,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tableRowsRef.current,
              start: "top 92%",
              once: true,
            },
          },
        );
      }
      if (predListRef.current) {
        const rows = predListRef.current.querySelectorAll(".prediction-row");
        gsap.fromTo(
          rows,
          { opacity: 0.35 },
          {
            opacity: 1,
            duration: 0.28,
            stagger: 0.025,
            ease: "power2.out",
            scrollTrigger: {
              trigger: predListRef.current,
              start: "top 92%",
              once: true,
            },
          },
        );
      }
    }, bentoRef);

    return () => ctx.revert();
  }, [tokens]);

  // Sequence Step-Through Replay loop (Section 02 Play button)
  useEffect(() => {
    if (!isReplaying) return undefined;
    if (tokens.length === 0) {
      setIsReplaying(false);
      setReplayStep(null);
      return undefined;
    }

    const stepDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 320 : 680;
    let current = 0;
    setReplayStep(0);
    setHighlightedIdx(0);

    const timer = window.setInterval(() => {
      current += 1;
      if (current >= tokens.length) {
        window.clearInterval(timer);
        setIsReplaying(false);
        setReplayStep(null);
        setHighlightedIdx(null);
      } else {
        setReplayStep(current);
        setHighlightedIdx(current);
      }
    }, stepDelay);

    return () => window.clearInterval(timer);
  }, [isReplaying, tokens]);

  const handleToggleReplay = useCallback(() => {
    setIsReplaying((prev) => {
      if (prev) {
        setReplayStep(null);
        setHighlightedIdx(null);
        return false;
      }
      return true;
    });
  }, []);

  const handleCalculate = useCallback(
    async (overrideSentence?: string) => {
      const targetText = typeof overrideSentence === "string" ? overrideSentence : sentence;
      if (isCalculating) return;
      setIsReplaying(false);
      setReplayStep(null);
      setHighlightedIdx(null);
      setIsCalculating(true);

      const result = await runPerplexityInference(targetText, (state, msg) => {
        setStatusState(state);
        setStatusMessage(msg);
      });

      if (result) {
        setTokens(result.tokens);
        setNextTokens(result.nextTokens);
        setIsCached(false);
        setSwapGeneration((g) => g + 1);
      }
      setIsCalculating(false);
    },
    [sentence, isCalculating],
  );

  const handleSampleClick = useCallback(
    (sample: string) => {
      setSentence(sample);
      void handleCalculate(sample);
    },
    [handleCalculate],
  );

  // Derived metrics for Section 02
  const metrics = useMemo(() => {
    const probs = tokens.map((t) => t.prob);
    const invs = tokens.map((t) => t.invProb);
    const perplexity = computePerplexityLogSpace(probs);
    const rawProduct = computeInverseProductLogSpace(invs);
    const badge = getIntuitionBadgeInfo(perplexity);
    const scalePct = getScalePercentage(perplexity);
    return { perplexity, rawProduct, badge, scalePct };
  }, [tokens]);

  return (
    <>
      {/* Snappy Preloader + Curved Arch Curtain Wipe */}
      <PreloaderCurtain isDark={isDark} onComplete={handlePreloaderComplete} />

      {/* Part 1.A: Exact-Source ThreeUI Fixed Full-Viewport Background */}
      <div
        className={`bg-arc-stage ${isDark ? "is-dark" : "is-light"}`}
        aria-hidden="true"
      >
        <div className="bg-arc-canvas-layer">
          <PredictiveArcCanvas
            variant="signal-particles"
            mode={isDark ? "dark" : "light"}
            speed={1.0}
            hue={0}
            saturation={1.0}
            brightness={1.0}
          />
        </div>
        <div className="bg-arc-veil" />
      </div>

      {/* Adaptive Sticky Header Bar */}
      <nav
        className={`sticky-top-bar hero-enter-item ${isScrolled ? "is-scrolled" : ""}`}
        aria-label="Workspace navigation"
      >
        <div className="sticky-bar-inner">
          <div className="sticky-brand">
            <span className="eyebrow-dot" aria-hidden="true" />
            <span className="sticky-eyebrow">IN-BROWSER LM LAB · DISTILGPT-2</span>
          </div>

          <div className="sticky-actions">
            <span className="sticky-ppl-chip tabular-nums" title="Current sequence perplexity">
              PPL {metrics.perplexity.toFixed(2)}
            </span>
            <button
              type="button"
              id="theme-toggle"
              className="btn-theme-toggle sheen-pill"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            >
              {isDark ? (
                <svg
                  className="theme-icon-sun"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  className="theme-icon-moon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
              <span>{isDark ? "Light mode" : "Dark mode"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div ref={appShellRef} className="container">
        {/* Hero / Title Lockup */}
        <GlassCard as="header" className="hero-card hero-enter-item">
          <div className="hero-top-meta">
            <span className="eyebrow-label">Scientific Instrument · Causal Transformer Entropy</span>
            <span className="hero-meta-spec">LOG-SPACE · BOS-PREFIXED · ZERO API</span>
          </div>
          <h1 className="hero-title">Perplexity Explorer</h1>
          <p className="header-subtitle">
            Autoregressive language models predict one token at a time. Perplexity measures their surprise:
            the geometric mean branching factor across the sequence. Inspect real DistilGPT-2 conditional
            probabilities, trace the math step by step, or simulate your own sequence.
          </p>
        </GlassCard>

        {/* SECTION 01: Full-Width Command Card */}
        <GlassCard id="section-input" className="hero-enter-item" ariaLabelledBy="sec1-title">
          <div className="panel-header-row">
            <h2 className="panel-title" id="sec1-title">
              <span className="section-num">01</span>
              Sentence Analysis
            </h2>
            <div className="status-pill" id="model-status" role="status" aria-live="polite">
              <span className={`status-dot ${statusState}`} id="status-dot" />
              <span id="status-text">{statusMessage}</span>
            </div>
          </div>

          <div className="command-bar">
            <input
              type="text"
              id="sentence-input"
              className="text-input"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleCalculate();
                }
              }}
              placeholder="Type a sentence to calculate perplexity..."
              aria-label="Sentence to analyze"
            />
            <div
              className={`threeui-btn-mount threeui-btn-mount--pill ${isCalculating ? "is-busy" : ""}`}
              aria-busy={isCalculating}
            >
              <LiquidMetalButton
                variant="pill"
                embedded
                text={isCalculating ? "Calculating..." : "Calculate perplexity"}
                onClick={() => void handleCalculate()}
              />
            </div>
          </div>

          <div className="samples-subrow">
            <div className="samples-pills">
              <span className="samples-label">Sample prompts:</span>
              {SAMPLE_PROMPTS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  className={`btn-pill btn-secondary-pill sheen-pill ${sentence.trim() === sample ? "is-selected" : ""}`}
                  onClick={() => handleSampleClick(sample)}
                >
                  <span>&ldquo;{sample}&rdquo;</span>
                </button>
              ))}
            </div>
            <span
              className={`sample-cache-tag ${isCached ? "is-cached" : "is-live"}`}
              id="sample-status-pill"
            >
              {isCached
                ? "Cached sample · Click Calculate to run DistilGPT-2 locally"
                : `Live neural output · ${tokens.length} tokens analyzed`}
            </span>
          </div>

          {statusState === "error" ? (
            <div className="error-box" id="error-message" role="alert">
              {statusMessage}
            </div>
          ) : null}
        </GlassCard>

        {/* SECTIONS 02 & 03: Asymmetric Bento Row (8 cols : 4 cols) */}
        <div ref={bentoRef} className="bento-row hero-enter-item">
          {/* Section 02: 8 columns */}
          <GlassCard id="section-breakdown" ariaLabelledBy="sec2-title">
            <div className="panel-header-row">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <h2 className="panel-title" id="sec2-title">
                  <span className="section-num">02</span>
                  Token Probabilities &amp; Perplexity
                </h2>
                <p className="panel-desc">
                  Conditional probability P(wᵢ | w&lt;ᵢ) and geometric mean derivation.
                </p>
              </div>
            </div>

            {/* Top KPI Header with Horizontal Perplexity Intuition Scale */}
            <div className="kpi-cockpit recessed-well">
              <div className="kpi-main-row">
                <div className="kpi-score-group fluid-swap-target">
                  <span className="kpi-score-label">Perplexity</span>
                  <span className="kpi-score-number" id="kpi-ppl-value">
                    <AnimatedNumber value={metrics.perplexity} />
                  </span>
                  <span className={`kpi-intuition-badge tone-${metrics.badge.tone}`} id="kpi-ppl-badge">
                    {metrics.badge.text}
                  </span>
                </div>
                <span className="kpi-formula-badge">PPL = (∏ 1/P)¹/ᴺ</span>
              </div>

              <div className="intuition-scale-box">
                <div className="scale-track-wrap">
                  <div className="scale-segments">
                    <div className="scale-segment scale-seg-predictable" title="1–10: Predictable" />
                    <div className="scale-segment scale-seg-natural" title="10–50: Natural" />
                    <div className="scale-segment scale-seg-odd" title="50–200: Odd" />
                    <div className="scale-segment scale-seg-surprising" title="200+: Surprising" />
                  </div>
                  <div
                    className="scale-needle-marker"
                    id="scale-needle"
                    style={{ left: `${metrics.scalePct}%` }}
                  />
                </div>
                <div className="scale-labels">
                  <span className="scale-label-item">1–10 Predictable</span>
                  <span className="scale-label-item">10–50 Natural</span>
                  <span className="scale-label-item">50–200 Odd</span>
                  <span className="scale-label-item">200+ Surprising</span>
                </div>
              </div>
            </div>

            {/* Synced Token Surprise Strip */}
            <div className="token-strip-panel">
              <span className="strip-eyebrow">Token Sequence (Hover or click to cross-examine)</span>
              <div className="token-surprise-strip recessed-well" id="token-surprise-strip">
                {tokens.map((item, idx) => {
                  const isSurprise = item.prob < 0.05;
                  const isCertain = item.prob >= 0.15;
                  const tintClass = isSurprise ? "chip-surprise" : isCertain ? "chip-certain" : "";
                  const pctStr =
                    item.prob * 100 < 1
                      ? `${(item.prob * 100).toFixed(1)}%`
                      : `${(item.prob * 100).toFixed(0)}%`;

                  return (
                    <button
                      key={`strip-${item.pos}-${idx}`}
                      type="button"
                      className={`interactive-token-chip ${tintClass} ${highlightedIdx === idx ? "is-active" : ""}`}
                      onMouseEnter={() => {
                        if (!isReplaying) setHighlightedIdx(idx);
                      }}
                      onMouseLeave={() => {
                        if (!isReplaying) setHighlightedIdx(null);
                      }}
                      onClick={() => {
                        setIsReplaying(false);
                        setReplayStep(null);
                        setHighlightedIdx((prev) => (prev === idx ? null : idx));
                      }}
                    >
                      <span>{item.displayToken}</span>
                      <span className="chip-prob-badge">{pctStr}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Single-Row 3-Column Horizontal Equation Strip with Shared Sheen */}
            <EquationStrip
              rawProduct={metrics.rawProduct}
              tokenCount={tokens.length}
              perplexity={metrics.perplexity}
              onActiveStepChange={setActiveEqStep}
            />

            {/* Tactile Dot-Grid Diagram Canvas + Play Replay Control */}
            <BranchingVisual
              tokens={tokens}
              highlightedIdx={highlightedIdx}
              isReplaying={isReplaying}
              replayStep={replayStep}
              onHighlight={setHighlightedIdx}
              onToggleReplay={handleToggleReplay}
            />

            {/* Inset Token Table with GPU-composited scaleX Micro-Bars */}
            <div className={`table-container recessed-well ${activeEqStep !== null ? `eq-focus-${activeEqStep}` : ""}`}>
              <table id="token-table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "2.75rem" }}>#</th>
                    <th scope="col">Token</th>
                    <th scope="col" style={{ minWidth: "150px" }}>Probability (P)</th>
                    <th scope="col" style={{ minWidth: "105px" }}>1 / P (Branching)</th>
                    <th scope="col" style={{ minWidth: "95px" }}>Surprise (−ln P)</th>
                  </tr>
                </thead>
                <tbody ref={tableRowsRef} id="token-table-body">
                  {tokens.map((item, idx) => {
                    const pct = (item.prob * 100).toFixed(2);
                    const probDisplay =
                      item.prob < 0.0001 ? item.prob.toExponential(3) : item.prob.toFixed(4);
                    const negLogP = (-Math.log(item.prob)).toFixed(2);
                    const isSurprise = item.prob < 0.05;
                    const barScale = Math.min(1, Math.max(0.03, item.prob));

                    return (
                      <tr
                        key={`row-${item.pos}-${idx}`}
                        className={highlightedIdx === idx ? "is-highlighted" : ""}
                        onMouseEnter={() => {
                          if (!isReplaying) setHighlightedIdx(idx);
                        }}
                        onMouseLeave={() => {
                          if (!isReplaying) setHighlightedIdx(null);
                        }}
                      >
                        <td style={{ color: "var(--text-stone-faint)", fontWeight: 600 }}>{idx + 1}</td>
                        <td>
                          <span className="token-chip">{item.displayToken}</span>
                        </td>
                        <td className="prob-bar-cell">
                          <div
                            className={`micro-bar-fill ${isSurprise ? "surprise" : ""}`}
                            style={{ transform: `scaleX(${barScale})` }}
                          />
                          <div className="prob-text-content tabular-nums">
                            <span>{probDisplay}</span>
                            <span className="prob-pct-inline">({pct}%)</span>
                          </div>
                        </td>
                        <td
                          className={`tabular-nums col-branching ${activeEqStep === 0 ? "is-step-emphasized" : ""}`}
                          style={{
                            fontWeight: 600,
                            color: isSurprise ? "var(--accent-surprise)" : "var(--text-stone)",
                          }}
                        >
                          {item.invProb.toFixed(2)}
                        </td>
                        <td
                          className={`tabular-nums col-surprise ${activeEqStep === 2 ? "is-step-emphasized" : ""}`}
                          style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--text-stone)" }}
                        >
                          {negLogP}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Section 03: 4 columns */}
          <GlassCard id="section-predictions" ariaLabelledBy="sec3-title">
            <div className="panel-header-row">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <h2 className="panel-title" id="sec3-title">
                  <span className="section-num">03</span>
                  Next-Token Distribution
                </h2>
                <p className="panel-desc fluid-swap-target">
                  Top 8 candidates after &ldquo;{tokens[tokens.length - 1]?.rawText.trim() || "terminus"}&rdquo;.
                </p>
              </div>
            </div>

            <div ref={predListRef} className="predictions-list" id="predictions-list">
              {nextTokens.map((item, index) => {
                const rank = item.rank || index + 1;
                const pctValue = (item.prob * 100).toFixed(1);
                const isTop = rank === 1;
                const scaleVal = Math.max(0.015, item.prob);

                return (
                  <div
                    key={`pred-${rank}-${item.id}`}
                    className={`prediction-row ${isTop ? "top-1" : ""}`}
                  >
                    <div className="pred-rank">{rank}</div>
                    <div className="pred-token" title={item.displayToken}>
                      <span className="token-chip">{item.displayToken}</span>
                    </div>
                    <div className="pred-bar-track">
                      <div
                        className="pred-bar-fill"
                        data-scale={scaleVal}
                        style={{ transform: `scaleX(${scaleVal})` }}
                      />
                    </div>
                    <div className="pred-pct tabular-nums">{pctValue}%</div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        <hr className="section-divider" />

        {/* SECTION 04: Interactive Sandbox ("Try It by Hand") */}
        <SandboxSection />
      </div>
    </>
  );
}
export default App;
