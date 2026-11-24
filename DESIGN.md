---
name: Perplexity Explorer
description: Interactive in-browser language model perplexity and next-token prediction laboratory
colors:
  primary: "#1d4ed8"
  primary-hover: "#1e40af"
  primary-active: "#172554"
  primary-subtle: "#eff6ff"
  primary-border: "#bfdbfe"
  secondary-violet: "#6d28d9"
  secondary-violet-subtle: "#f5f3ff"
  secondary-violet-border: "#ddd6fe"
  accent-green: "#047857"
  accent-green-bg: "#ecfdf5"
  accent-green-border: "#a7f3d0"
  accent-amber: "#92400e"
  accent-amber-bg: "#fef3c7"
  accent-amber-border: "#fde68a"
  accent-red: "#b91c1c"
  accent-red-bg: "#fef2f2"
  accent-red-border: "#fecaca"
  canvas-bg: "#f8fafc"
  card-bg: "#ffffff"
  text-ink: "#0f172a"
  text-body: "#1e293b"
  text-muted: "#334155"
  text-faint: "#475569"
  text-subtle: "#64748b"
  border-hairline: "#cbd5e1"
  border-subtle: "#e2e8f0"
  border-strong: "#94a3b8"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  title-lg:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  subhead:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
  mono:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "12px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card:
    backgroundColor: "{colors.card-bg}"
    rounded: "{rounded.lg}"
    padding: "1.75rem"
  token-badge:
    backgroundColor: "{colors.canvas-bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "0.22rem 0.55rem"
---

## Overview
Perplexity Explorer's visual system unites **Experience** and **Operate** modes: an interactive scientific instrument delivering mathematical transparency, editorial dignity, and dense engineering scanability. The aesthetic avoids generic AI SaaS conventions (purple-to-pink gradient floods, muddy shadows, and heavy nested cards) in favor of a crisp architectural light palette, subtle dot-grid atmospheric canvas, hairline structural borders, and purposeful cobalt/indigo accents.

## Colors
- **Primary Cobalt (`#1d4ed8`)**: Used for the primary call-to-action button, active indicator glyphs, and the final perplexity readout. Delivers $> 8.5:1$ contrast against pure white.
- **Secondary Violet (`#6d28d9`)**: Quiet secondary highlight for mathematical emphasis, used with strict restraint.
- **Functional Semantics**:
  - **Emerald Green (`#047857` / `#ecfdf5`)**: Signifies model readiness and low surprise, with $> 5:1$ contrast.
  - **Dark Amber (`#92400e` / `#fef3c7`)**: Distinctly marks simulated sandbox content ("Simulated, not from the model") with $> 7:1$ contrast.
  - **Deep Red (`#b91c1c` / `#fef2f2`)**: Marks input validation errors, network failures, or extreme surprise with $> 6.5:1$ contrast.
- **Neutrals**:
  - Canvas background: `#f8fafc` layered with subtle geometric micro-grid texture (`radial-gradient(circle at 1px 1px, rgba(71, 85, 105, 0.1) 1px, transparent 0)`).
  - Cards: Crisp `#ffffff`.
  - Hairline borders: `#cbd5e1` and `#e2e8f0`.
  - Typography: Deep ink `#0f172a` for primary headings, `#1e293b` for body copy, `#334155` for muted descriptions, and `#475569` for tabular metadata.

## Typography
- **Primary Typography**: Native system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) for crisp, immediate rendering without webfont latency.
- **Code & Token Font**: Monospace stack (`SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace`) for tokens, math expressions, and raw IDs.
- **Tabular Figures**: Every numeric column, percentage, and mathematical step enforces `font-variant-numeric: tabular-nums` to ensure steady, jitter-free live updates.
- **Whitespace Representation**: Space characters inside decoded tokens are explicitly styled with quiet visible glyphs (`␣`) in `#64748b`.

## Layout
- **Single Column Container**: Maximum width capped at `960px`, centered with responsive padding (`1.25rem` mobile, `2.75rem` desktop) for optimal line length and mathematical legibility.
- **Vertical Card Rhythm**: Consistent `2rem` vertical spacing separating the 4 sequential conceptual stages:
  1. Sentence Analysis Workbench
  2. Per-Token Probabilities & Step-by-Step Derivation
  3. Next-Token Distribution
  4. Manual Sandbox ("Try It by Hand")
- **Flattened Hierarchies**: Card-inside-card nesting is avoided; internal steps and tables use clean dividers (`border-top: 1px solid var(--border-subtle)`), generous inset padding, and tonal callout panels.

## Elevation & Depth
- Architectural flat design grounded by hairline structural borders (`1px solid #cbd5e1`).
- Layered hairline drop shadows (`0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`).
- Accessible focus rings utilize a sharp 3px outer halo in cobalt (`rgba(29, 78, 216, 0.15)`).

## Shapes
- **Outer Cards**: Disciplined `12px` (`--radius-lg`) corner radii.
- **Buttons & Inputs**: Medium `10px` (`--radius-md`) radius for touch target ergonomics.
- **Badges & Tokens**: Compact `6px` (`--radius-sm`) radius for token framing.
- **Step Counters**: Crisp `4px` (`--radius-xs`) radius for structural numbers (`01`, `02`, `03`, `04`).
- **Pills & Indicator Dots**: Fully rounded `9999px` (`--radius-pill`) for category badges and prediction bar tracks.

## Components
- **Primary CTA Button**: Solid deep cobalt background (`#1d4ed8`), subtle inner top highlight (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18)`), and tactile active depression (`scale(0.97)`).
- **Sample & Preset Buttons**: Hairline-bordered secondary pills with smooth hover transition and tactile active press.
- **Token Table**: Inset tabular rows with subtle alternating hovers, distinct monospace token chips, and explicit reciprocal branching values ($1/P$).
- **3-Step Breakdown Box**: Flattened derivation sequence separating the product formula, sequence length $N$, and the final geometric mean perplexity callout.
- **Next-Token Prediction Rows**: Ranked horizontal bars with custom cubic-bezier fill transitions and subtle emphasis on #1.
- **Try-It-By-Hand Simulator**: Dynamic editable rows with inline validation, quick presets, and live reactive mathematical recalculation.

## Do's and Don'ts
- **DO** display spaces explicitly as `␣` inside tokens so BPE tokenization is visually obvious.
- **DO** compute perplexity in log-space (`Math.exp(mean(-Math.log(P)))`) to avoid arithmetic overflow.
- **DO** clearly distinguish between genuine model inference and manual simulation.
- **DON'T** nest cards inside cards; use structural dividers, spacing, and tonal backgrounds instead.
- **DON'T** use `ease-in` on interactive UI components.
- **DON'T** animate layout properties (`width`, `height`, `margin`) when GPU transforms (`transform: scaleX()`, `opacity`) are available.
- **DON'T** use `transition: all`. Explicitly specify animated properties.
