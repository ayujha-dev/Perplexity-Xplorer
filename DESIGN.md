---
name: Perplexity Explorer
description: In-browser language model perplexity and next-token prediction laboratory
colors:
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  primary-active: "#3730a3"
  primary-light: "#eef2ff"
  primary-border: "#c7d2fe"
  accent-purple: "#7c3aed"
  accent-purple-light: "#f5f3ff"
  accent-green: "#059669"
  accent-green-light: "#ecfdf5"
  accent-amber: "#92400e"
  accent-amber-bg: "#fef3c7"
  accent-amber-border: "#fde68a"
  accent-red: "#b91c1c"
  accent-red-light: "#fef2f2"
  accent-red-border: "#fecaca"
  neutral-bg: "#f8fafc"
  card-bg: "#ffffff"
  text-main: "#0f172a"
  text-muted: "#334155"
  text-faint: "#475569"
  border-card: "#cbd5e1"
  border-subtle: "#e2e8f0"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title-lg:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.01em"
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
    letterSpacing: "0em"
  mono:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "18px"
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
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "0.2rem 0.5rem"
---

## Overview
Perplexity Explorer's visual identity embodies the **Operate** surface mode: an interactive ML utility and educational laboratory where scanability, clarity, and mathematical rigor take precedence. The interface uses a clean light palette with white elevated cards, soft neutral boundaries, and purposeful indigo/purple accents to draw focus to interactive controls and predictions without cognitive clutter.

## Colors
- **Primary Indigo (`#4f46e5`)**: Used for the primary call-to-action button, active accents, section highlights, and #1 prediction indicator.
- **Support Violet (`#7c3aed`)**: Secondary accent gradient for peak predictions and mathematical emphasis.
- **Functional Semantics**:
  - **Emerald Green (`#059669` / `#ecfdf5`)**: Signifies high probability, model readiness, and low surprise.
  - **Dark Amber (`#92400e` / `#fef3c7`)**: Identifies manual simulated content ("Simulated, not from the model") and moderate surprise, delivering > 7:1 WCAG contrast.
  - **Deep Red (`#b91c1c` / `#fef2f2`)**: Highlights errors, invalid inputs, or extreme model surprise, delivering > 5:1 WCAG contrast.
- **Neutrals**: Canvas background at `#f8fafc`, cards at pure `#ffffff`, borders at `#cbd5e1` and `#e2e8f0`, primary text at `#0f172a`, and muted labels at `#334155` and `#475569`.

## Typography
- **Primary Typeface**: Native system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) for snappy native rendering and zero external font network latency.
- **Code & Token Font**: Monospace stack (`SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace`) for tokens, math expressions, and raw IDs.
- **Tabular Figures**: Every numeric column and computation uses `font-variant-numeric: tabular-nums` to eliminate layout jitter during recalculation.

## Layout
- **Single Column Container**: Maximum width capped at `960px`, centered with fluid padding (`1.25rem` mobile, `2.5rem` desktop) for optimal line lengths and mathematical scanning.
- **Vertical Card Rhythm**: Consistent `2rem` vertical gap separating the 4 sequential conceptual stages:
  1. Input Sentence & Model Control
  2. Per-Token Probabilities & 3-Step Perplexity Breakdown
  3. Top 8 Next-Token Predictions
  4. Manual Interactive Sandbox
- **Responsive Stacking**: Form inputs, sample pills, and prediction grid gracefully adapt across viewport sizes from 320px mobile to 4K displays.

## Elevation & Depth
- Flat surface design layered with crisp hairline borders (`1px solid #cbd5e1`).
- Subtle card drop shadow (`0 1px 2px 0 rgba(15, 23, 42, 0.05)`) to delineate active workspace cards from the background canvas.
- Focus states utilize an accessible 3px outer glow in brand indigo (`rgba(79, 70, 229, 0.15)`).

## Shapes
- **Outer Cards**: Rounded corners at `14px` (`--radius-lg`) for a friendly yet structured feel.
- **Buttons & Inputs**: Medium radius at `10px` (`--radius-md`) providing comfortable touch targets.
- **Badges & Tokens**: Compact radius at `6px` (`--radius-sm`) to cleanly frame token characters and whitespace glyphs (`␣`).
- **Pills**: Fully rounded `9999px` (`--radius-pill`) for category tags, status chips, and prediction bar containers.

## Components
- **Primary Button**: Indigo solid background, crisp white typography, subtle active scale depression (`scale(0.97)`), and disabled state opacity.
- **Sample Button**: Light outlined chip that invites immediate exploration with zero typing barrier.
- **Token Table**: Structured tabular rows with alternating hover highlights, distinct monospace token chips, and explicit probability breakdowns.
- **3-Step Breakdown Box**: Distinct nested panels separating the product formula, token count N, and the final geometric mean perplexity card with explanatory interpretation.
- **Top 8 Prediction Rows**: Ranked horizontal bars with custom cubic-bezier fill transitions and gradient highlighting on #1.
- **Try-It-By-Hand Simulator**: Dynamic editable rows with inline validation, quick presets, and live reactive mathematical recalculation.

## Do's and Don'ts
- **DO** display spaces explicitly as `␣` inside tokens so whitespace tokenization is visually obvious.
- **DO** compute perplexity in log-space (`Math.exp(mean(-Math.log(P)))`) to avoid arithmetic overflow.
- **DO** clearly distinguish between genuine model inference and manual simulation.
- **DON'T** use `ease-in` on interactive UI components.
- **DON'T** animate layout properties (`width`, `height`, `margin`) when GPU transforms (`transform: scaleX()`, `opacity`) are available.
- **DON'T** use `transition: all`. Explicitly specify animated properties.
