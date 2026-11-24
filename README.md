# Perplexity Explorer ⚡

An interactive, educational in-browser laboratory for language model perplexity and next-token prediction.

Run real neural network causal inference (DistilGPT-2 via Transformers.js) directly inside your browser—zero API keys, zero servers, zero build steps.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Transformers.js](https://img.shields.io/badge/🤗_Transformers.js-v3-orange?style=flat)
![Zero_Config](https://img.shields.io/badge/Zero_Config-Static_App-success?style=flat)

---

## Features

- **⚡ Real In-Browser Inference**: Lazy-loads `Xenova/distilgpt2` (q8 ONNX quantization) via Transformers.js v3.
- **🔢 Conditional Token Probabilities**: Augmented BOS prefixing (`[50256, ...tokens]`) computes real conditional probabilities for every token, including the first word.
- **📐 3-Step Perplexity Breakdown**:
  - **Step 1**: Explicit product of all inverse probabilities ($\prod \frac{1}{P}$).
  - **Step 2**: Total token count $N$.
  - **Step 3**: Geometric mean perplexity $(\prod \frac{1}{P})^{1/N}$, computed in log-space to prevent arithmetic underflow/overflow.
- **🔮 Next-Token Predictions**: Top 8 predicted tokens visualised as horizontal percentage bars with custom easing and highlight on #1.
- **🧪 "Try It by Hand" Interactive Simulator**: Test manual probabilities with instant reactive feedback and presets:
  - *"I love Python"* ($0.5, 0.8, 0.2$) $\to$ Perplexity: **2.32**
  - *"All 1/8"* ($8$ tokens at $0.125$) $\to$ Perplexity: **8.00**
  - *"One surprising word"* ($0.9, 0.9, 0.9, 0.01$) $\to$ Perplexity: **3.42**
- **🎨 Emil Kowalski Micro-Interactions**: Custom cubic-bezier easings (`cubic-bezier(0.23, 1, 0.32, 1)`), tactile press feedback, and 60fps GPU-composited transitions.
- **♿ WCAG 2.2 AA Conformance**: High-contrast typography, keyboard navigation, and reduced-motion support.

---

## Quick Start

Open `index.html` in any modern web browser or serve it with any local static server:

```bash
# Python
python3 -m http.server 3000

# Or npx serve
npx serve .
```

---

## Math Behind Perplexity

Perplexity ($PPL$) is the geometric mean of the inverse probabilities of a sequence of tokens:

$$\text{PPL}(W) = \exp\left( \frac{1}{N} \sum_{i=1}^N -\ln P(w_i \mid w_1, \dots, w_{i-1}) \right)$$

Intuitively, a perplexity of **$k$** means that on average at each word, the language model was as uncertain as choosing uniformly between **$k$** equally likely words. Lower perplexity indicates the model was less surprised by the text.

---

## License

MIT
