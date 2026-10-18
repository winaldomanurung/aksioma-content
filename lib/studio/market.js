// Shared constants for the market primitives: priceChart, stockCompare,
// tradePlan and eventCalendar. Heights are fixed in globals.css (.mkt-*), so
// capacity is known by construction; these limits keep every text on its line.

export const LEVEL_KINDS = {entry: "Entry", target: "Target", stop: "Cut loss", support: "Support", resistance: "Resistance"};
export const CHART_LIMITS = {minPoints: 5, maxPoints: 60, levels: 4, title: 40, caption: 80, label: 12, levelLabel: 14};

export const COMPARE_LIMITS = {rows: 6, ticker: 8, name: 24, label: 22, value: 18};
export const COMPARE_BETTER = ["left", "right"];

export const PLAN_KINDS = {bull: "Skenario naik", base: "Skenario dasar", bear: "Skenario turun"};
export const PLAN_LIMITS = {scenarios: 3, ticker: 8, title: 40, trigger: 80, target: 24, note: 80, risk: 100};

export const CALENDAR_LIMITS = {items: 6, date: 10, title: 36, tag: 12, note: 64};

// 1.250 / 1.250,5 style (Indonesian). Done by hand so server and browser agree.
export function fmtPrice(n) {
  if (!Number.isFinite(n)) return "";
  const abs = Math.abs(n);
  const fixed = Number.isInteger(n) || abs >= 100 ? String(Math.round(n * 100) / 100) : (Math.round(n * 100) / 100).toFixed(2);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? grouped + "," + dec : grouped;
}

export const RANK_LIMITS = {items: 6, ticker: 8, value: 16, change: 9};
export const RANK_TONES = ["up", "down", "neutral"];
