import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // The dependency array matters: without it this effect re-ran after every
    // render and kept firing navigations.
    const timer = setTimeout(() => {
      void router.push("/");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="min-h-screen-safe relative flex w-full flex-col items-center justify-center overflow-hidden px-5 text-center"
      style={{ backgroundColor: WINE }}
    >
      <span
        aria-hidden="true"
        className="font-bebas pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none leading-none"
        style={{ fontSize: "44vw", color: "rgba(255,255,255,0.035)" }}
      >
        404
      </span>

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3">
          <span className="h-px w-[22px]" style={{ backgroundColor: GOLD }} />
          <span
            className="font-open text-[11px] uppercase tracking-[0.16em]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Hiba
          </span>
        </div>

        <h1
          className="font-bebas mt-4 uppercase leading-[0.98] text-[#f4ece9]"
          style={{ fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 4rem)" }}
        >
          Ez az oldal <span style={{ color: BLUSH }}>nem található</span>
        </h1>

        <p
          className="font-open mt-4 max-w-md text-[15px]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Néhány másodperc múlva átirányítunk a főoldalra.
        </p>

        <Link
          href="/"
          className="font-bebas mt-8 rounded-full border px-8 py-3 text-[20px] tracking-[0.03em] no-underline transition-colors duration-200"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          Vissza a főoldalra
        </Link>
      </div>
    </div>
  );
}
