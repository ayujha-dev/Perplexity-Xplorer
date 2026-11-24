# Perplexity Explorer ⚡

An interactive, museum-grade in-browser laboratory for language model perplexity and next-token prediction.

Run real neural network causal inference (DistilGPT-2 via Transformers.js) directly inside your browser—zero API keys, zero servers, zero build steps.

[![Live Demo](https://img.shields.io/badge/Live_Demo-perplexity--xplorer.vercel.app-1d4ed8?style=for-the-badge&logo=vercel)](https://perplexity-xplorer.vercel.app)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Transformers.js](https://img.shields.io/badge/🤗_Transformers.js-v3-orange?style=flat)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat&logo=vercel)
![Zero_Config](https://img.shields.io/badge/Zero_Config-Static_App-success?style=flat)

---

## 🌐 Live Application

- **Production URL**: [https://perplexity-xplorer.vercel.app](https://perplexity-xplorer.vercel.app)
- **GitHub Repository**: [https://github.com/ayujha-dev/Perplexity-Xplorer](https://github.com/ayujha-dev/Perplexity-Xplorer)

---

## Key Highlights

- **⚡ Genuine In-Browser Neural Inference**: Lazy-loads `Xenova/distilgpt2` (`dtype: "q8"`) via Transformers.js v3 on the first calculation click. Real model outputs are never fabricated.
- **🔢 Conditional Token Likelihoods**: Augmented BOS prefixing (`[50256, ...tokens]`) computes real conditional probabilities for every token, including the first word.
- **📐 Explicit 3-Step Perplexity Breakdown**:
  - **Step 1**: Mathematical product of all inverse probabilities ($\prod \frac{1}{P}$).
  - **Step 2**: Total sequence token count $N$.
  - **Step 3**: Geometric mean perplexity $(\prod \frac{1}{P})^{1/N}$, computed in log-space to prevent arithmetic underflow/overflow.
- **🔮 Next-Token Distribution**: Top 8 predicted tokens visualised as horizontal percentage bars with custom easing and understated highlight on #1.
- **🧪 "Try It by Hand" Interactive Simulator**: Test manual probabilities with instant reactive feedback and presets:
  - *"I love Python"* ($0.5, 0.8, 0.2$) $\to$ Perplexity: **2.32**
  - *"All 1/8"* ($8$ tokens at $0.125$) $\to$ Perplexity: **8.00**
  - *"One surprising word"* ($0.9, 0.9, 0.9, 0.01$) $\to$ Perplexity: **3.42**
- **🏛️ High-Craft Experience + Operate Design**:
  - Architectural light palette with subtle micro-dot grid paper texture (`20px 20px`).
  - Zero AI slop: no loud neon gradients, no muddy heavy shadows, and no generic stacked cards.
  - Deep ink typography, hairline structural borders (`#cbd5e1`), and restrained cobalt accents.
- **🎨 Emil Kowalski Micro-Interactions**:
  - Custom cubic-bezier curves (`cubic-bezier(0.23, 1, 0.32, 1)`).
  - Tactile press compression (`transform: scale(0.97)` on `:active`).
  - 60fps GPU-composited transitions (`transform: scaleX(...)`, `opacity`).
- **♿ Universal Accessibility**: Full WCAG 2.2 AA conformance (text contrast $\ge 5.2:1$), keyboard navigation, and first-class reduced-motion support.

---

## Quick Start

Open `index.html` directly in any modern web browser or serve it with any local static server:

```bash
# Python
python3 -m http.server 3000

# Or npx serve
npx serve .
```

---

## Math Behind Perplexity

Perplexity ($PPL$) is the geometric mean of the inverse probabilities of a sequence of tokens:

$$\text{PPL}(W) = \exp\left( \frac{1}{N} \sum_{i=1}^N -\ln P(w_i \mid w_1, \dots, w_{i-1}) \right) = \left( \prod_{i=1}^N \frac{1}{P(w_i \mid w_{<i})} \right)^{1/N}$$

Intuitively, a perplexity of **$k$** means that on average at each word, the language model was as uncertain as choosing uniformly between **$k$** equally likely words. Lower perplexity indicates the model was less surprised by the text.

---

## Architecture & Documents

- [PRODUCT.md](file:///Users/ayu/Desktop/ppXplorer/PRODUCT.md) — Product truth, audience, and Experience + Operate specification.
- [DESIGN.md](file:///Users/ayu/Desktop/ppXplorer/DESIGN.md) — Design system tokens, color palette, typography ramp, and component rules.
- [index.html](file:///Users/ayu/Desktop/ppXplorer/index.html) — Single self-contained source file.

---

## License

MIT
