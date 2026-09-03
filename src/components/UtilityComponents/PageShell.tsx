import Link from "next/link";
import type { ReactNode } from "react";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";
const LAVENDER = "#cdb8dd";
const CREAM = "#f6efe6";
const INK_SOFT = "#6b5a63";

type Props = {
  /**
   * Short marker shown before the title and as a background watermark. Usually the
   * two-digit index this page has in its homepage list (the "Általános tudnivalók"
   * and "Aktuális kiadás" lists are numbered independently); the archive pages
   * pass a year instead.
   */
  number?: string;
  /** Small caps label above the title, e.g. "Aktuális kiadás". */
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

/**
 * Shared frame for every subpage: a wine header band that carries the same
 * typography and decorative language as the homepage sections, followed by a
 * cream content area. Replaces the ad-hoc `bg-lightGray / lg:bg-primaryLight`
 * wrapper that each page used to repeat.
 */
const PageShell = ({ number, eyebrow, title, children }: Props) => {
  return (
    <div className="min-h-screen-safe flex w-full flex-col" style={{ backgroundColor: CREAM }}>
      <header
        className="relative overflow-hidden px-5 pb-12 pt-[104px] sm:px-6 sm:pb-14 sm:pt-[124px] lg:px-11"
        style={{ backgroundColor: WINE }}
      >
        {number && (
          <span
            aria-hidden="true"
            className="font-bebas pointer-events-none absolute -right-8 -top-14 select-none leading-none"
            style={{
              // A four-digit year needs a smaller size than a two-digit index,
              // otherwise the watermark is wider than the viewport.
              fontSize: number.length > 2 ? "20vw" : "34vw",
              color: "rgba(255,255,255,0.03)",
            }}
          >
            {number}
          </span>
        )}

        {/* thin decorative line-art, desktop only — matches the homepage sections */}
        <svg
          className="pointer-events-none absolute -right-6 top-16 hidden w-[360px] opacity-55 lg:block"
          viewBox="0 0 400 200"
          fill="none"
        >
          <path
            d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
            stroke={GOLD}
            strokeWidth="1"
            opacity="0.7"
          />
          <path
            d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
            stroke={BLUSH}
            strokeWidth="1"
            opacity="0.7"
          />
        </svg>
        <svg
          className="pointer-events-none absolute -left-12 -bottom-6 hidden w-[380px] -scale-x-100 opacity-50 lg:block"
          viewBox="0 0 400 200"
          fill="none"
        >
          <path
            d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
            stroke={LAVENDER}
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
            stroke={GOLD}
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-[1320px]">
          <Link
            href="/"
            className="font-open group mb-7 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] no-underline transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <span
              className="font-open inline-block transition-transform duration-200 group-hover:-translate-x-1"
              aria-hidden="true"
            >
              ←
            </span>
            Vissza a főoldalra
          </Link>

          {eyebrow && (
            <div className="flex items-center gap-3">
              <span className="h-px w-[22px] shrink-0" style={{ backgroundColor: GOLD }} />
              <span
                className="font-open text-[11px] uppercase tracking-[0.16em] sm:text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {eyebrow}
              </span>
            </div>
          )}

          <h1
            className="font-bebas mt-3 max-w-4xl uppercase leading-[0.98] text-[#f4ece9]"
            style={{ fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 4rem)" }}
          >
            {number && <span style={{ color: BLUSH }}>{number} — </span>}
            {title}
          </h1>
        </div>
      </header>

      <main className="relative flex-1 px-5 py-11 sm:px-6 sm:py-14 lg:px-11">
        <div className="mx-auto w-full max-w-[1100px]">{children}</div>
      </main>

      <footer
        className="px-5 pb-9 sm:px-6 lg:px-11"
        style={{ color: INK_SOFT }}
      >
        <div className="mx-auto w-full max-w-[1100px] border-t pt-5" style={{ borderColor: "rgba(44,23,40,0.12)" }}>
          <span className="font-open text-[11px] uppercase tracking-[0.12em]" style={{ color: "rgba(44,23,40,0.4)" }}>
            Erdélyi Tudományos Diákköri Konferencia — Kolozsvár
          </span>
        </div>
      </footer>
    </div>
  );
};

export default PageShell;
