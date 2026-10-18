"use client";

import {useEffect} from "react";

// Last-resort boundary for every route. In this Next.js version the recovery
// callback is `retry` (see node_modules/next/dist/docs, file convention error.js).
export default function RouteError({error, retry}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-zinc-900">
      <h1 className="font-display text-2xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Halaman ini gagal ditampilkan. Muat ulang, atau kembali ke halaman sebelumnya.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-600"
      >
        Coba lagi
      </button>
    </main>
  );
}
