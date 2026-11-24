# Concepts Brief: Perplexity Explorer Layout, Glass Chrome & Icon Overhaul

## Problem Statement
The current Perplexity Explorer interface provides accurate in-browser causal language model inference and perplexity calculations, but its visual presentation is somewhat flat and rigidly vertical. The user requested:
1. A refined layout that improves density and visual cohesion between the branching visualization and token tables.
2. Glassmorphic minimalist styling focused on chrome elements (header, input dock, status bar, and metric highlights) while preserving high text contrast.
3. A functional, comprehensive SVG icon system across sections, headers, and actions.

---

## Architectural & Design Decisions

### 1. Layout Refinement (Single-Column Linear Cockpit)
- **Unified Section 2 Data Grid**: In Section 2 (Token Probabilities & Perplexity), place the interactive Branching Factor visualization and the Token Probabilities table in a responsive split layout (side-by-side on wide screens `>960px`, seamlessly stacked on tablets/mobile) rather than stacking them in separate disconnected blocks.
- **Tighter Spacing Rhythm**: Reduce vertical gaps between sections from `3.5rem` to `2.25rem`, increasing information density and reducing unnecessary scrolling.
- **Section Headers with Integrated Chips & Icons**: Eliminate kicker labels. Use inline section badges (`01`, `02`, `03`, `04`) paired with clean vector icons directly inside the section title rows.

### 2. Glassmorphic Minimalist Design (Glass Chrome Accents)
- **Glass Header & Theme Bar**: Translucent header dock with `backdrop-filter: blur(16px)`, `background: rgba(255, 255, 255, 0.7)` (light) / `rgba(26, 25, 24, 0.75)` (dark), subtle 1px specular border `rgba(255, 255, 255, 0.4)` / `rgba(255, 255, 255, 0.08)`, and soft elevation.
- **Glass Input Workbench Dock**: Translucent input field and calculate button bar with subtle backdrop blur.
- **Glass Status Pill**: Translucent floating model status bar with glowing status indicator.
- **Glass Metric Hero Card**: The final Perplexity Step 3 summary card receives a frosted glass treatment with a subtle ambient radial glow behind it.
- **Readability Preservation**: Data tables, formula breakdown panels, and token chips remain solid/semi-opaque to prevent visual noise behind numbers, strictly maintaining WCAG AA $\ge 4.5:1$ contrast in both light and dark modes.

### 3. Comprehensive Vector Icon System
All icons use lightweight inline SVG (20px / 18px / 16px, uniform 1.75px stroke, rounded caps and joins):
- **Section 01 (Sentence Workbench)**: Terminal prompt icon (`>_`), calculation play icon, sample quote icons.
- **Section 02 (Derivation & Table)**: Mathematical function icon (`f(x)`), table column icons (`#` hash for index, `T` typography for token, crosshair target for probability $P$, branching fork for $1/P$).
- **Section 03 (Predictions)**: Bar chart distribution icon, rank badge icons.
- **Section 04 (Sandbox Simulator)**: Laboratory flask/beaker icon, plus icon on Add Token, trash icon on row delete.
- **Controls**: Sun/Moon theme toggle icons.

---

## Stress-Testing & Trade-Off Analysis

| Axis | Risk / Challenge | Mitigation Strategy |
| :--- | :--- | :--- |
| **Performance (Backdrop Blur)** | `backdrop-filter: blur()` can trigger composite layer overhead if overused on large scrolling surfaces. | Limit blur strictly to chrome containers (`header`, `input-dock`, `status-bar`, `step-hero-card`). Avoid blurs on table cells or repeated rows. |
| **Contrast & Readability** | Glassmorphic backgrounds can cause text contrast to degrade if background images or patterns bleed through. | Maintain high-opacity backing (`0.85` opacity ground) under tables and text, and adjust text color tokens in dark mode to `#F5F4F0` and `#5B9CFF`. |
| **Impeccable & Taste Compliance** | Generic glassmorphism with harsh neon borders triggers design anti-patterns. | Use disciplined hairline borders (`1px solid rgba(...)`), restrained corner radii (14px–20px), and neutral specular reflections without rainbow gradient borders. |
