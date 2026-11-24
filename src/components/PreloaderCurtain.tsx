import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderCurtainProps {
  isDark: boolean;
  onComplete: () => void;
}

const WORDMARK = "PERPLEXITY".split("");

/**
 * Snappy (~1850ms) editorial preloader with masked letter rise,
 * rapid data-pattern flash inside letterforms, and curved parabolic
 * top-arch curtain wipe revealing the live PredictiveArcCanvas + Hero.
 */
export function PreloaderCurtain({ isDark, onComplete }: PreloaderCurtainProps) {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return false;
    try {
      if (sessionStorage.getItem("ppx_preloader_seen") === "1") return false;
    } catch {
      // ignore storage errors
    }
    return true;
  });

  const [pct, setPct] = useState(0);
  const [patternStep, setPatternStep] = useState(0);
  const [patternSettled, setPatternSettled] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem("ppx_preloader_seen", "1");
    } catch {
      // ignore
    }
    setVisible(false);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    const root = rootRef.current;
    const archPath = pathRef.current;
    if (!root || !archPath) {
      finish();
      return;
    }

    const letters = root.querySelectorAll<HTMLElement>(".preloader-letter-inner");
    const counterEl = root.querySelector<HTMLElement>(".preloader-counter");

    // Rapid data-pattern texture flash inside letterforms every 140ms
    const flashTimer = window.setInterval(() => {
      setPatternStep((s) => (s + 1) % 4);
    }, 140);

    const progressState = { val: 0 };
    const wipeState = { progress: 0 };

    const updateArchPath = (progress: number) => {
      // progress 0 -> 1: bottom-to-top wipe with ~80px convex parabolic top arch flattening to 0
      // Coordinate space: viewBox 0 0 1000 1000 (normalized)
      const topY = 0 + progress * -1080; // moves upward out of viewport
      const bottomY = 1000 - progress * 1000;
      const archLift = Math.sin(progress * Math.PI) * 90; // convex parabolic arch peaking at ~80-90px
      const edgeY = bottomY;
      const ctrlY = Math.max(-120, edgeY - archLift);

      // Curtain fills from 0 down to edgeY, or sweeps upward from bottom leaving curved leading edge
      // Actually: bottom-rising curtain reveal means the curtain covers [0 .. edgeY] and its BOTTOM edge curves up, OR
      // curtain rises UP from y=0..1000 to y=-1000..0 with a parabolic top arch!
      // Let's draw the curtain covering from (0, curveY) down to (1000, 1000) so as it rises up or slides up:
      // Wait: if top arch rises from y=0? No, if the curtain covers the viewport and lifts UPWARD, the bottom edge lifts OR a second arch rises from bottom!
      // Making the curtain lift UPWARD with a curved arch at its bottom edge (`M 0 0 L 1000 0 L 1000 ${edgeY} Q 500 ${edgeY - archLift} 0 ${edgeY} Z`)
      // creates the classic curved arch wipe revealing the live canvas underneath from the bottom upward!
      const d =
        progress <= 0.001
          ? "M 0 0 L 1000 0 L 1000 1000 L 0 1000 Z"
          : `M 0 ${topY} L 1000 ${topY} L 1000 ${edgeY} Q 500 ${ctrlY} 0 ${edgeY} Z`;
      archPath.setAttribute("d", d);
    };

    updateArchPath(0);

    const tl = gsap.timeline({
      onComplete: () => {
        window.clearInterval(flashTimer);
        finish();
      },
    });

    // 0 -> 420ms: Staggered letter rise (40ms stagger, 420ms duration)
    tl.fromTo(
      letters,
      { yPercent: 105, opacity: 0.01 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.42,
        stagger: 0.04,
        ease: "expo.out",
      },
      0,
    );

    if (counterEl) {
      tl.fromTo(
        counterEl,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" },
        0.04,
      );
    }

    // 0 -> 1180ms: Snappy tabular-nums progress 0% -> 100%
    tl.to(
      progressState,
      {
        val: 100,
        duration: 1.18,
        ease: "power2.inOut",
        onUpdate: () => setPct(Math.round(progressState.val)),
        onComplete: () => {
          window.clearInterval(flashTimer);
          setPatternSettled(true);
        },
      },
      0.06,
    );

    // 1320ms -> 1800ms: Curved arch curtain wipe (480ms, cubic-bezier(0.76, 0, 0.24, 1))
    tl.to(
      wipeState,
      {
        progress: 1,
        duration: 0.48,
        ease: "power3.inOut",
        onUpdate: () => updateArchPath(wipeState.progress),
      },
      1.32,
    );

    // Fade wordmark cleanly into the wipe
    tl.to(
      ".preloader-lockup",
      {
        y: -28,
        opacity: 0,
        duration: 0.36,
        ease: "power3.in",
      },
      1.34,
    );

    const handleSkip = (e: KeyboardEvent | MouseEvent) => {
      if ("key" in e && e.key !== "Escape" && e.key !== "Enter" && e.key !== " ") return;
      window.clearInterval(flashTimer);
      tl.kill();
      finish();
    };

    window.addEventListener("keydown", handleSkip);
    root.addEventListener("click", handleSkip);

    return () => {
      window.clearInterval(flashTimer);
      window.removeEventListener("keydown", handleSkip);
      root.removeEventListener("click", handleSkip);
      tl.kill();
    };
  }, [visible, finish, onComplete]);

  if (!visible) return null;

  const fillColor = isDark ? "#0d0d0c" : "#ffffff";

  return (
    <div
      ref={rootRef}
      className={`preloader-curtain ${isDark ? "is-dark" : "is-light"}`}
      role="dialog"
      aria-label="Loading Perplexity Explorer"
      title="Click or press Escape to skip"
    >
      <svg
        className="preloader-arch-svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={pathRef} fill={fillColor} d="M 0 0 L 1000 0 L 1000 1000 L 0 1000 Z" />
      </svg>

      <div className="preloader-lockup">
        <div className="preloader-top-meta">
          <span className="preloader-counter" aria-live="polite">
            {String(pct).padStart(3, "0")}%
          </span>
          <span className="preloader-hint">IN-BROWSER CAUSAL LAB · CLICK OR ESC TO SKIP</span>
        </div>

        <div
          className={`preloader-wordmark ${patternSettled ? "is-solid" : `pattern-${patternStep}`}`}
          aria-hidden="true"
        >
          {WORDMARK.map((ch, idx) => (
            <span key={idx} className="preloader-letter-mask">
              <span className="preloader-letter-inner">{ch}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
