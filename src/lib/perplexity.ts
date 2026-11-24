type TransformersModule = typeof import("@huggingface/transformers");
let transformersMod: TransformersModule | null = null;

async function getTransformers(): Promise<TransformersModule> {
  if (!transformersMod) {
    transformersMod = await import("@huggingface/transformers");
    transformersMod.env.allowLocalModels = false;
  }
  return transformersMod;
}

export type ModelStatusState = "idle" | "loading" | "ready" | "error";

export interface TokenResult {
  pos: number;
  id: number;
  rawText: string;
  displayToken: string;
  prob: number;
  invProb: number;
}

export interface NextTokenCandidate {
  rank: number;
  id: number;
  rawText: string;
  displayToken: string;
  prob: number;
}

export interface SimRow {
  id: string;
  token: string;
  prob: string;
}

export const CACHED_SAMPLE: {
  sentence: string;
  tokens: TokenResult[];
  nextTokens: NextTokenCandidate[];
} = {
  sentence: "The capital of France is Paris",
  tokens: [
    { pos: 1, id: 464, rawText: "The", displayToken: "The", prob: 0.0462, invProb: 21.645 },
    { pos: 2, id: 3139, rawText: " capital", displayToken: "␣capital", prob: 0.0034, invProb: 294.118 },
    { pos: 3, id: 286, rawText: " of", displayToken: "␣of", prob: 0.7412, invProb: 1.349 },
    { pos: 4, id: 4881, rawText: " France", displayToken: "␣France", prob: 0.1654, invProb: 6.046 },
    { pos: 5, id: 318, rawText: " is", displayToken: "␣is", prob: 0.8129, invProb: 1.230 },
    { pos: 6, id: 6342, rawText: " Paris", displayToken: "␣Paris", prob: 0.5482, invProb: 1.824 },
  ],
  nextTokens: [
    { rank: 1, id: 13, rawText: ".", displayToken: ".", prob: 0.3842 },
    { rank: 2, id: 11, rawText: ",", displayToken: ",", prob: 0.1925 },
    { rank: 3, id: 290, rawText: " and", displayToken: "␣and", prob: 0.0814 },
    { rank: 4, id: 198, rawText: "\n", displayToken: "↵", prob: 0.0421 },
    { rank: 5, id: 357, rawText: " (", displayToken: "␣(", prob: 0.0335 },
    { rank: 6, id: 373, rawText: " was", displayToken: "␣was", prob: 0.0218 },
    { rank: 7, id: 287, rawText: " in", displayToken: "␣in", prob: 0.0189 },
    { rank: 8, id: 546, rawText: " -", displayToken: "␣-", prob: 0.0142 },
  ],
};

export type PresetKey = "surprise" | "python" | "uniform";

export const SANDBOX_PRESETS: Record<PresetKey, { label: string; rows: Array<{ token: string; prob: string }> }> = {
  surprise: {
    label: '"One surprising word" (0.9, 0.9, 0.9, 0.01)',
    rows: [
      { token: "The", prob: "0.9" },
      { token: "weather", prob: "0.9" },
      { token: "is", prob: "0.9" },
      { token: "banana", prob: "0.01" },
    ],
  },
  python: {
    label: '"I love Python" (0.5, 0.8, 0.2)',
    rows: [
      { token: "I", prob: "0.5" },
      { token: "love", prob: "0.8" },
      { token: "Python", prob: "0.2" },
    ],
  },
  uniform: {
    label: '"All 1/8" (8 tokens at 0.125)',
    rows: Array.from({ length: 8 }, (_, idx) => ({
      token: `token_${idx + 1}`,
      prob: "0.125",
    })),
  },
};

export const SAMPLE_PROMPTS = [
  "The capital of France is Paris",
  "I love Python",
  "Python love I",
] as const;

export function formatTokenDisplay(rawToken: string): string {
  if (!rawToken) return "empty";
  return rawToken.replace(/\n/g, "↵").replace(/ /g, "␣");
}

/**
 * Computes Perplexity = exp( mean( -ln(P) ) ) strictly in log-space
 * to prevent floating-point overflow/underflow on long sequences.
 */
export function computePerplexityLogSpace(probList: number[]): number {
  if (!probList || probList.length === 0) return 0;
  let sumNegativeLog = 0;
  for (const p of probList) {
    if (p <= 0) return Infinity;
    sumNegativeLog += -Math.log(p);
  }
  const meanNegLog = sumNegativeLog / probList.length;
  return Math.exp(meanNegLog);
}

export function computeInverseProductLogSpace(invValues: number[]): number {
  if (!invValues.length) return 0;
  let logProduct = 0;
  for (const v of invValues) {
    logProduct += Math.log(v);
  }
  return Math.exp(logProduct);
}

export function formatScientificProduct(rawProduct: number): { base: string; exp: number | null } {
  if (!Number.isFinite(rawProduct)) return { base: "∞", exp: null };
  if (rawProduct >= 10000) {
    const exp = Math.floor(Math.log10(rawProduct));
    const base = (rawProduct / Math.pow(10, exp)).toFixed(2);
    return { base, exp };
  }
  return { base: rawProduct.toFixed(2), exp: null };
}

/**
 * Maps Perplexity to horizontal Intuition Scale percentage (0-100%):
 * 1-10 (0-25%), 10-50 (25-50%), 50-200 (50-75%), 200+ (75-100%)
 */
export function getScalePercentage(ppl: number): number {
  if (!Number.isFinite(ppl)) return 98;
  if (ppl <= 1) return 2;
  if (ppl <= 10) {
    return Math.min(25, Math.max(2, ((ppl - 1) / 9) * 25));
  }
  if (ppl <= 50) {
    return 25 + Math.min(25, Math.max(0, ((ppl - 10) / 40) * 25));
  }
  if (ppl <= 200) {
    return 50 + Math.min(25, Math.max(0, ((ppl - 50) / 150) * 25));
  }
  return Math.min(98, 75 + ((Math.min(ppl, 1000) - 200) / 800) * 23);
}

export function getIntuitionBadgeInfo(ppl: number): {
  text: string;
  tone: "certain" | "amber" | "surprise";
} {
  if (ppl <= 10) {
    return { text: "Predictable (1–10)", tone: "certain" };
  }
  if (ppl <= 50) {
    return { text: "Natural (10–50)", tone: "certain" };
  }
  if (ppl <= 200) {
    return { text: "Odd (50–200)", tone: "amber" };
  }
  return { text: "Surprising (200+)", tone: "surprise" };
}

// Singleton model/tokenizer state with concurrent promise guard
let tokenizer: Awaited<ReturnType<TransformersModule["AutoTokenizer"]["from_pretrained"]>> | null = null;
let model: Awaited<ReturnType<TransformersModule["AutoModelForCausalLM"]["from_pretrained"]>> | null = null;
let modelLoadingPromise: Promise<boolean> | null = null;

async function ensureModelLoaded(
  onStatus: (state: ModelStatusState, msg: string) => void,
): Promise<boolean> {
  if (model && tokenizer) return true;
  if (modelLoadingPromise) {
    return await modelLoadingPromise;
  }

  onStatus("loading", "Downloading DistilGPT-2 weights (~82MB)...");

  modelLoadingPromise = (async () => {
    try {
      const { env, AutoTokenizer, AutoModelForCausalLM } = await getTransformers();
      env.allowLocalModels = false;

      const progressCallback = (data: { status?: string; file?: string; loaded?: number; total?: number }) => {
        if (data && data.status === "progress" && data.total && data.loaded !== undefined) {
          const pct = Math.round((data.loaded / data.total) * 100);
          onStatus("loading", `Downloading ${data.file || "weights"}: ${pct}%`);
        } else if (data && data.status === "initiate") {
          onStatus("loading", `Initiating ${data.file || "model"}...`);
        } else if (data && data.status === "ready") {
          onStatus("loading", "Finalizing model in memory...");
        }
      };

      tokenizer = await AutoTokenizer.from_pretrained("Xenova/distilgpt2", {
        progress_callback: progressCallback,
      });
      model = await AutoModelForCausalLM.from_pretrained("Xenova/distilgpt2", {
        dtype: "q8",
        progress_callback: progressCallback,
      });

      onStatus("ready", "DistilGPT-2 ready (q8)");
      return true;
    } catch (err) {
      console.error("Failed to load DistilGPT-2 model:", err);
      const message = err instanceof Error ? err.message : String(err);
      onStatus("error", `Load error: ${message}`);
      modelLoadingPromise = null;
      return false;
    }
  })();

  return await modelLoadingPromise;
}

export async function runPerplexityInference(
  sentence: string,
  onStatus: (state: ModelStatusState, msg: string) => void,
): Promise<{ tokens: TokenResult[]; nextTokens: NextTokenCandidate[] } | null> {
  const text = sentence.trim();
  if (!text) {
    onStatus("error", "Please enter a sentence to calculate perplexity.");
    return null;
  }

  const ready = await ensureModelLoaded(onStatus);
  if (!ready || !tokenizer || !model) return null;

  onStatus("loading", `Calculating perplexity for "${text}"...`);

  try {
    const { Tensor } = await getTransformers();
    const rawEncoded = await tokenizer.encode(text);
    const encodedIds: number[] = Array.isArray(rawEncoded)
      ? rawEncoded
      : Array.from(rawEncoded as Iterable<number>);

    if (!encodedIds || encodedIds.length === 0) {
      throw new Error("Tokenizer returned 0 tokens for input.");
    }

    // Prepend GPT-2 BOS/EOS token (50256) so position 0 receives conditional likelihood
    const BOS_TOKEN_ID = 50256;
    const allTokenIds = [BOS_TOKEN_ID, ...encodedIds];
    const nTokens = allTokenIds.length;

    const input_ids = new Tensor(
      "int64",
      BigInt64Array.from(allTokenIds, BigInt),
      [1, nTokens],
    );

    const attention_mask = new Tensor(
      "int64",
      new BigInt64Array(nTokens).fill(1n),
      [1, nTokens],
    );

    const outputs = (await model({ input_ids, attention_mask })) as {
      logits: { dims: number[]; data: Float32Array };
    };
    const [, seqLen, vocabSize] = outputs.logits.dims;
    const logitsData = outputs.logits.data;

    const results: TokenResult[] = [];
    for (let i = 1; i < nTokens; i++) {
      const targetId = allTokenIds[i];
      const pos = i - 1;
      const slice = logitsData.subarray(pos * vocabSize, (pos + 1) * vocabSize);

      let maxLogit = -Infinity;
      for (let v = 0; v < vocabSize; v++) {
        if (slice[v] > maxLogit) maxLogit = slice[v];
      }

      let sumExp = 0;
      for (let v = 0; v < vocabSize; v++) {
        sumExp += Math.exp(slice[v] - maxLogit);
      }

      const targetLogit = slice[targetId];
      const prob = Math.exp(targetLogit - maxLogit) / sumExp;
      const rawDecoded = tokenizer.decode([targetId]);

      results.push({
        pos: i,
        id: targetId,
        rawText: rawDecoded,
        displayToken: formatTokenDisplay(rawDecoded),
        prob,
        invProb: 1 / prob,
      });
    }

    // Top 8 next-token candidates from terminus position
    const lastSlice = logitsData.subarray((seqLen - 1) * vocabSize, seqLen * vocabSize);
    let maxLogitLast = -Infinity;
    for (let v = 0; v < vocabSize; v++) {
      if (lastSlice[v] > maxLogitLast) maxLogitLast = lastSlice[v];
    }

    let sumExpLast = 0;
    for (let v = 0; v < vocabSize; v++) {
      sumExpLast += Math.exp(lastSlice[v] - maxLogitLast);
    }

    const top8: Array<{ id: number; prob: number }> = [];
    for (let v = 0; v < vocabSize; v++) {
      const prob = Math.exp(lastSlice[v] - maxLogitLast) / sumExpLast;
      if (top8.length < 8) {
        top8.push({ id: v, prob });
        top8.sort((a, b) => b.prob - a.prob);
      } else if (prob > top8[7].prob) {
        top8[7] = { id: v, prob };
        top8.sort((a, b) => b.prob - a.prob);
      }
    }

    const nextTokens: NextTokenCandidate[] = top8.map((item, index) => {
      const decoded = tokenizer!.decode([item.id]);
      return {
        rank: index + 1,
        id: item.id,
        rawText: decoded,
        displayToken: formatTokenDisplay(decoded),
        prob: item.prob,
      };
    });

    onStatus("ready", "DistilGPT-2 live output");
    return { tokens: results, nextTokens };
  } catch (err) {
    console.error("Calculation error:", err);
    const message = err instanceof Error ? err.message : String(err);
    onStatus("error", `Calculation error: ${message}`);
    return null;
  }
}
