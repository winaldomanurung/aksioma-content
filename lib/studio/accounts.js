// Dua akun Aksioma dalam satu studio.
//   trader  : finance, saham, pasar. Komponen dan preset saham tersedia.
//   journey : topik umum (AI, pengembangan diri, dan lainnya).
// Akun sebuah carousel disimpan di meta.account. Bila JSON tidak menyebutnya,
// carousel mengikuti akun aktif yang dipilih di navigasi (lihat account-store.js).
// File ini murni data, jadi aman dipakai server (schema, /api) maupun browser.

export const DEFAULT_ACCOUNT = "trader";

export const ACCOUNTS = Object.freeze({
  trader: Object.freeze({
    id: "trader", label: "Trader", name: "Aksioma Trader",
    summary: "Finance, saham, dan pasar",
    handle: "@aksioma.trader", website: "aksioma-trader.com",
    audience: "Investor ritel Indonesia",
  }),
  journey: Object.freeze({
    id: "journey", label: "Journey", name: "Aksioma Journey",
    summary: "AI, pengembangan diri, dan topik umum",
    handle: "@aksioma.journey", website: "aksioma-journey.com",
    audience: "Young professionals",
  }),
});
export const ACCOUNT_IDS = Object.keys(ACCOUNTS);

export const isAccountId = (value) => typeof value === "string" && Object.prototype.hasOwnProperty.call(ACCOUNTS, value);
// Nilai tak dikenal jatuh ke `fallback`, tidak melempar error.
export const accountOf = (value, fallback = DEFAULT_ACCOUNT) => (isAccountId(value) ? value : (isAccountId(fallback) ? fallback : DEFAULT_ACCOUNT));
