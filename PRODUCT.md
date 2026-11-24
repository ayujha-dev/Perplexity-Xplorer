# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Plain HTML, CSS, and vanilla JavaScript (single self-contained index.html with Transformers.js via ESM CDN).

## Users
Students, machine learning practitioners, software developers, and researchers seeking to deeply understand how language models assign probabilities to text, how perplexity is mathematically derived, and how surprise impacts model evaluation.

## Product Purpose
Perplexity Explorer is an interactive, educational in-browser laboratory for language model perplexity and next-token prediction. It demystifies language model uncertainty by running real client-side neural network inference (DistilGPT-2 via Transformers.js), calculating per-token conditional probabilities with numerically stable softmax, visualizing the explicit three-step perplexity breakdown, showing top-8 next-token predictions, and offering a simulated sandbox for manual experimentation.

## Positioning
Unlike static textbook formulas or black-box API endpoints, Perplexity Explorer executes genuine neural network inference directly in the browser with zero backend requirements or API keys, while simultaneously pairing real model outputs with an interactive manual simulator that makes the exponential/log-space mathematics immediately tangible.

## Operating Context
Interactive ML utility and educational tool operating in **Operate** surface mode. The interface prioritizes scanability, numerical precision, live responsiveness, and clear distinction between model-generated facts and manual simulations.

## Capabilities and Constraints
- In-browser neural inference using Xenova/distilgpt2 (q8 quantization) via Transformers.js.
- BOS prefixing ([50256, ...tokens]) ensuring every token (including the first) receives a well-defined conditional probability.
- Numerically stable softmax probability calculation over the 50,257-token vocabulary.
- Log-space computation: Math.exp(mean(-Math.log(P))) to avoid overflow/underflow.
- Explicit 3-step breakdown: (1) Multiplication of 1/P terms, (2) Token count N, (3) Large display of Perplexity = (product)^(1/N).
- Next-token distribution with top-8 horizontal percentage bars, highlighting #1.
- Manual sandbox ("Simulated, not from the model") with interactive presets, dynamic row editing, and live reactive updates.
- Hard constraint: 100% self-contained single index.html file with zero runtime external app files, frameworks, or bundlers.

## Brand Commitments
- Name: Perplexity Explorer
- Visual Direction: Clean light UI with white cards, subtle border elevations, rounded corners (8px–12px), primary indigo/violet accents (#4f46e5 / #4338ca), emerald accents for high probability, amber/rose for low probability/surprise.
- Tone: Scholarly yet welcoming, precise, and transparent.

## Product Principles
1. **Mathematical Honesty**: Always derive probabilities directly from logits; never fabricate or fake model output.
2. **Explicit Derivations**: Break down formulas into digestible intermediate steps with readable notation.
3. **Instant Responsiveness**: Lazy-load the heavy model only when requested; provide sample prompts and presets that evaluate instantaneously.
4. **Accessible Craft**: High contrast text, full keyboard navigation, clear aria-live announcements, and reduced-motion respect.

## Accessibility & Inclusion
WCAG 2.2 AA compliant typography, contrast ratios exceeding 4.5:1, semantic HTML5 structure, accessible form controls with explicit labels, aria-live regions for calculation statuses, and keyboard-focusable action targets.
