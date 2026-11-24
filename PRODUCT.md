# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Single self-contained index.html (semantic HTML5, modern CSS with Beside-inspired calm soft-paper architecture, Google Fonts Inter with system fallback, and vanilla ES modules with Transformers.js v3). Zero runtime frameworks, external CSS libraries, bundlers, or server backends.

## Users
Machine learning engineers, researchers, educators, students, and software practitioners seeking an authentic, calm, and mathematically rigorous in-browser instrument to understand language model uncertainty, token likelihoods, and perplexity.

## Product Purpose
Perplexity Explorer transforms abstract statistical formulas into an exquisite, calm, typographic interactive instrument inspired by Beside (`beside.com`). Visitors can run genuine causal neural inference (DistilGPT-2 via Transformers.js v3) directly inside their web browser, inspect exact token conditional probabilities, follow the geometric mean derivation step by step, explore next-token distributions with Beside's bright blue accent, and experiment with manual simulated scenarios.

## Positioning
Rejecting generic AI SaaS tropes (neon purple gradients, heavy muddy dropshadows, noisy glassmorphism, and cramped cards), Perplexity Explorer embodies a "soft paper calm, ink-black intent" aesthetic: crisp white ground (`#FFFFFF`), warm soft-paper off-white panels (`#F7F6F3`) with hairline borders (`#EBEBEB`), warm ink-black headings (`#1E1D1C`), muted stone labels (`#78756F`), and Beside's electric blue accent (`#498FFF`). Real neural model outputs are never fabricated.

## Operating Context
Dual **Experience + Operate** interactive explainer. The interface combines the typographic poise and calm spatial breathing room of a luxury editorial publication with the dense scanability and instant numerical reactivity required of a precision engineering tool.

## Capabilities and Constraints
- In-browser causal language model inference using `Xenova/distilgpt2` (`dtype: "q8"`) via Transformers.js v3 with `env.allowLocalModels = false`.
- Dual tensor feed (`input_ids` and `attention_mask`) with BOS token prefix (`[50256, ...tokens]`) ensuring authentic conditional probabilities across all sequence positions.
- Shared loading promise guard preventing duplicate model downloads on rapid clicks.
- Numerically stable max-subtracted softmax calculation over DistilGPT-2's 50,257-token vocabulary.
- Log-space computation (`Math.exp(mean(-Math.log(P)))`) preventing numerical overflow/underflow.
- Explicit 3-step breakdown: (1) Multiplication of all inverse probabilities $\prod 1/P$, (2) Sequence token count $N$, (3) Prominent ink-black display of Perplexity = $(\prod 1/P)^{1/N}$ with intuitive physical explanation.
- Next-token distribution with top-8 candidates rendered as GPU-composited horizontal percentage bars, highlighting #1 with Beside blue (`#498FFF`).
- "Try it by hand" manual sandbox (`"SIMULATED · NOT FROM MODEL"`) with dynamic rows, inline validation, presets, and live reactive updates.
- Hard constraint: 100% self-contained single `index.html` file runnable without build tools.

## Brand Commitments
- Name: Perplexity Explorer
- Visual Identity: Beside-inspired aesthetic ("soft paper calm, ink-black intent").
  - Ground: Crisp white `#FFFFFF`
  - Primary Panels & Cards: Warm soft-paper off-white `#F7F6F3` with delicate `1px` `#EBEBEB` hairline borders
  - Inset Cards: Crisp `#FFFFFF` surfaces nested inside `#F7F6F3` panels for dimensional restraint
  - Primary Text: Warm ink-black `#1E1D1C`
  - Helper & Secondary Text: Muted warm stone `#78756F` (with high-contrast variants for accessibility)
  - Primary Accent: Bright blue `#498FFF`
  - Semantic Accents: Coral-red `#FF7A7A` / `#D32F2F` and warm amber `#FFBC74` / `#B45309`
- Geometry: Generous `20px` radii on cards, full pill radius (`9999px`) on buttons and status badges, `16px` grid gaps, `64px–80px` vertical section rhythm, max content width `1120px`.
- Typography: Inter with tight negative tracking on headlines, generous body line height, `ui-monospace` uppercase eyebrows with `0.08em` tracking, and `font-variant-numeric: tabular-nums` for all numbers.

## Product Principles
1. **Calm Typographic Clarity**: Let spacious layout, refined typography, and warm paper textures speak louder than decorative noise.
2. **Mathematical Honesty**: Always derive probabilities directly from model logits; never display fake or hallucinated outputs.
3. **Flawless In-Browser Reliability**: Guard against local file 404s, provide both `input_ids` and `attention_mask`, and surface real error messages.
4. **Subtle Tactile Feedback**: Pill button press compression (`scale(0.98)`), sub-300ms transitions with custom cubic-bezier curves, and GPU-composited motion.
5. **Universal Accessibility**: Strict WCAG 2.2 AA contrast compliance, complete keyboard navigation, and first-class reduced-motion support.

## Accessibility & Inclusion
Full WCAG 2.2 AA compliance: contrast ratios exceeding 4.5:1 for body and 3:1 for large display text, semantic HTML5 structure, accessible pill hit targets ($\ge 44\text{px}$ height), ARIA live regions for calculation state, and `@media (prefers-reduced-motion: reduce)` accommodation.
