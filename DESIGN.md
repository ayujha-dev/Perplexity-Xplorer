---
name: Perplexity Explorer
description: Beside-inspired in-browser language model perplexity and next-token prediction laboratory
colors:
  bg-canvas: "#ffffff"
  bg-panel: "#f7f6f3"
  bg-card: "#ffffff"
  bg-pill: "#f3f3f3"
  bg-subtle: "#f9f9f8"
  text-ink: "#1e1d1c"
  text-body: "#2b2a28"
  text-stone: "#5f5c56"
  text-stone-faint: "#78756f"
  text-muted: "#94918a"
  primary-accent: "#498fff"
  primary-accent-subtle: "#ebf3ff"
  primary-accent-border: "#bcd8ff"
  accent-coral: "#b91c1c"
  accent-coral-border: "#ff7a7a"
  accent-coral-bg: "#fef2f2"
  accent-amber: "#92400e"
  accent-amber-border: "#ffbc74"
  accent-amber-bg: "#fef3c7"
  accent-emerald: "#065f46"
  accent-emerald-bg: "#ecfdf5"
  accent-emerald-border: "#a7f3d0"
  border-hairline: "#ebebeb"
  border-stone: "#dedcd8"
  border-hover: "#ecebe7"
  ink-pure: "#000000"
  white-pure: "#ffffff"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  display-mobile:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  title-lg:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  body-sm:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  caption:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.84375rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
  caption-sm:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
  eyebrow:
    fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  card: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "36px"
  xxl: "56px"
components:
  panel:
    backgroundColor: "{colors.bg-panel}"
    borderColor: "{colors.border-hairline}"
    rounded: "{rounded.card}"
    padding: "2.25rem"
  button-primary:
    backgroundColor: "{colors.text-ink}"
    textColor: "{colors.bg-panel}"
    rounded: "{rounded.pill}"
    height: "46px"
  button-secondary:
    backgroundColor: "{colors.bg-pill}"
    borderColor: "{colors.border-hairline}"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.pill}"
    height: "38px"
  token-chip:
    backgroundColor: "{colors.bg-pill}"
    borderColor: "{colors.border-hairline}"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.sm}"
