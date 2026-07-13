import type { TableStatus } from "./types";

export const colors = {
  bg: "oklch(0.93 0.008 250)",
  text: "oklch(0.22 0.02 260)",
  accent: "oklch(0.55 0.15 250)",
  border: "oklch(0.88 0.008 250)",
  borderLight: "oklch(0.91 0.008 250)",
  borderLighter: "oklch(0.94 0.006 250)",
  panelBg: "oklch(0.95 0.006 250)",
  panelBgAlt: "oklch(0.97 0.006 250)",
  muted: "oklch(0.5 0.02 260)",
  mutedLight: "oklch(0.55 0.02 260)",
  mutedLighter: "oklch(0.6 0.02 260)",
  dark: "oklch(0.2 0.02 260)",
  darker: "oklch(0.16 0.02 260)",
  danger: "oklch(0.55 0.15 30)",
  dangerBorder: "oklch(0.85 0.06 30)",
  green: "oklch(0.55 0.13 150)",
};

export const statusColors: Record<TableStatus, { bg: string; border: string; dot: string; label: string }> = {
  free: { bg: "oklch(0.94 0.03 150)", border: "oklch(0.7 0.1 150)", dot: "oklch(0.6 0.13 150)", label: "Free" },
  occupied: { bg: "oklch(0.94 0.05 75)", border: "oklch(0.72 0.13 75)", dot: "oklch(0.65 0.15 75)", label: "Occupied" },
  billing: { bg: "oklch(0.93 0.03 250)", border: "oklch(0.65 0.14 250)", dot: "oklch(0.55 0.15 250)", label: "Ready to Bill" },
};
