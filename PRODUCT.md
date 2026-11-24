# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Single self-contained index.html (plain semantic HTML5, modern CSS with architectural depth and micro-grid texture, vanilla ES modules with Transformers.js v3). Zero runtime frameworks, external stylesheets, bundlers, or server dependencies.

## Users
Machine learning engineers, researchers, students, and curious software practitioners seeking to build visceral, grounded intuition for language model uncertainty, conditional token likelihoods, and the mathematical mechanics of perplexity.

## Product Purpose
Perplexity Explorer transforms abstract statistical formulas into a tactile, museum-grade scientific instrument. It allows visitors to examine genuine client-side neural language model inference (DistilGPT-2 via Transformers.js), inspect exact token-by-token branching factors, follow an explicit step-by-step arithmetic derivation, observe next-token probability distributions, and experiment with interactive manual simulations to see how individual unexpected words swing perplexity.

## Positioning
Unlike textbook equations or generic AI SaaS toys with cookie-cutter cards and purple gradients, Perplexity Explorer is designed with editorial gravity and scientific dignity. It executes genuine client-side neural weights in real time without fake probabilities, presenting raw token mechanics with architectural precision, high tabular readability, and clear separation between model-derived facts and manual sandbox simulations.

## Operating Context
Dual **Experience + Operate** interactive explainer. The interface combines the editorial polish and atmospheric poise of an architectural scientific exhibit with the dense scanability, instant reactivity, and strict numerical discipline required of an engineering analysis workbench.

## Capabilities and Constraints
- In-browser causal language model inference using `Xenova/distilgpt2` (`dtype: "q8"`) via Transformers.js v3.
- BOS token prefixing (`[50256, ...tokens]`) ensuring every token (including the sentence-opener) receives an authentic conditional probability from position 0.
- Numerically stable max-subtracted softmax calculation over DistilGPT-2's 50,257-token vocabulary.
- Log-space computation (`Math.exp(mean(-Math.log(P)))`) guaranteeing zero numerical overflow or underflow across arbitrary sequence lengths.
- Explicit 3-step breakdown: (1) Multiplication of all inverse probabilities $\prod 1/P$, (2) Sequence token count $N$, (3) Prominent readout of Perplexity = $(\prod 1/P)^{1/N}$ with clear physical interpretation.
- Next-token prediction distribution rendering top-8 candidates as GPU-composited horizontal percentage bars, highlighting #1.
- "Try it by hand" manual sandbox (`"Simulated, not from the model"`) with editable rows, dynamic insertion/deletion, preset controls, and live mathematical reactivity.
- Hard constraint: 100% self-contained single `index.html` file runnable anywhere.

## Brand Commitments
- Name: Perplexity Explorer
- Aesthetic Direction: High-craft, anti-slop architectural light theme. Warm alabaster/linen ground (`#f8f9fa` to `#f4f5f7`) with a subtle geometric hairline micro-grid texture. Crisp pure white cards (`#ffffff`) framed with hairline borders (`#e2e5e9`) and disciplined corner radii. Deep charcoal ink typography (`#111827`), muted graphite metadata (`#4b5563`), restrained cobalt primary accent (`#2563eb` / `#1d4ed8`), with quiet secondary violet accents.
- Zero generic AI slop: no loud purple-pink gradient fills, no oversized muddy dropshadows, no floating blur orbs, and no generic stacked cards.

## Product Principles
1. **Museum-Grade Scientific Rigor**: Present mathematical derivations and neural distributions as transparent, reproducible instruments.
2. **Ground Truth Integrity**: Derive model probabilities exclusively from real logits; never fake or hallucinate neural predictions.
3. **Restrained Editorial Typography**: Use high-contrast editorial hierarchy, tabular figures for all numeric columns, and visible monospace glyphs (`␣`) for whitespace tokens.
4. **Instant Tactile Reactivity**: Fast response times, sub-300ms interactive transitions, subtle press physics, and smooth GPU-composited visual bars.
5. **Universal Accessibility**: Strict WCAG 2.2 AA conformance across all contrast ratios, complete keyboard navigability, and first-class reduced-motion support.

## Accessibility & Inclusion
Full WCAG 2.2 AA compliance: contrast ratios exceeding 5:1 for body and 4.5:1 for metadata, semantic HTML landmarks (`<header>`, `<main>`, `<section>`), explicit form labels, ARIA live regions for calculation state, and comprehensive `@media (prefers-reduced-motion: reduce)` accommodation.
