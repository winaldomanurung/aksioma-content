// Shared constants for the stockList primitive (components/carousel/StockList.jsx).
//
// The list shows exactly as many stocks as the author supplies (1 to 8). To keep
// every count inside one 1080x1350 slide the row layout changes with the count:
//
//   full     1-3 stocks  large cards: ticker, levels, and a note of up to 2 lines
//   medium   4-5 stocks  medium cards: one level line and a one-line note
//   compact  6-8 stocks  single-line rows; no note (there is no room for it)
//
// Row heights are fixed in globals.css (.stock-list), so the capacity is exact
// by construction instead of depending on text wrapping. The character limits
// below keep every text on its line.

export const STOCK_MAX_ITEMS = 8;

// signal -> default pill label (an item's own `action` text wins).
export const STOCK_SIGNALS = {
  buy: "Beli",
  accumulate: "Akumulasi",
  hold: "Tahan",
  watch: "Pantau",
  sell: "Jual",
};

export const STOCK_DISCLAIMER = "Bukan ajakan membeli atau menjual. Lakukan riset sendiri dan kelola risiko.";

export const stockTier = (count) => (count <= 3 ? "full" : count <= 5 ? "medium" : "compact");

// Longest note per tier. 0 = notes are not displayed, so they are not allowed.
export const STOCK_NOTE_LIMIT = {full: 90, medium: 56, compact: 0};

export const STOCK_LIMITS = {ticker: 8, name: 28, action: 14, entry: 16, target: 12, stop: 12, disclaimerText: 90};

export const STOCK_LABELS = {entry: "Entry", target: "Target", stop: "Cut loss"};
