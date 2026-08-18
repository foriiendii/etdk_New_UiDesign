import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SanityApplicate } from "types";
import RichText from "@utils/RichText";
import GetImage from "./../../utils/getImage";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";
const CREAM = "#f6efe6";
const INK_SOFT = "#6b5a63";
const LINE = "rgba(44,23,40,0.14)";

const ACCENTS = [GOLD, BLUSH, WINE];
const ACCENT_TINTS = [
  "rgba(212,175,106,0.12)",
  "rgba(231,169,180,0.14)",
  "rgba(44,23,40,0.08)",
];

// Reveals children once, the first time the element scrolls into view.
const useInView = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
};

// Fades the cue element out as the section scrolls past the top of the viewport.
// Mutates the DOM directly (no React state) so this never triggers a re-render on scroll.
const useScrollFade = <S extends HTMLElement, C extends HTMLElement = HTMLDivElement>(
  fadeDistance = 240
) => {
  const sectionRef = useRef<S | null>(null);
  const cueRef = useRef<C | null>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const section = sectionRef.current;
      const cue = cueRef.current;
      if (!section || !cue) return;
      const top = section.getBoundingClientRect().top;
      const progress = Math.min(Math.max(-top / fadeDistance, 0), 1);
      cue.style.opacity = String(1 - progress);
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fadeDistance]);

  return [sectionRef, cueRef] as const;
};

const WhyApplicate = ({
  small_benefit,
  big_benefit,
  title,
  description,
}: SanityApplicate) => {
  const [sectionRef, visible] = useInView<HTMLDivElement>();
  const [scrollSectionRef, scrollCueRef] = useScrollFade<HTMLDivElement>();
  const setSectionNode = (node: HTMLDivElement | null) => {
    sectionRef.current = node;
    scrollSectionRef.current = node;
  };

  return (
    <div
      ref={setSectionNode}
      style={{ backgroundColor: CREAM }}
      className="relative flex w-full flex-col overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="font-bebas pointer-events-none absolute -right-10 -top-16 select-none text-[36vw] leading-none"
        style={{ color: "rgba(44,23,40,0.035)" }}
      >
        02
      </span>

      {/* thin decorative line-art, desktop only — matches hero */}
      <svg
        className="pointer-events-none absolute -right-5 top-6 hidden w-[360px] opacity-40 lg:block"
        viewBox="0 0 400 200"
        fill="none"
      >
        <path
          d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
          stroke={GOLD}
          strokeWidth="1"
          opacity="0.8"
        />
        <path
          d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
          stroke={BLUSH}
          strokeWidth="1"
          opacity="0.8"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -left-10 bottom-0 hidden w-[400px] -scale-x-100 opacity-30 lg:block"
        viewBox="0 0 400 200"
        fill="none"
      >
        <path
          d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
          stroke="#cdb8dd"
          strokeWidth="1"
          opacity="0.9"
        />
        <path
          d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
          stroke={WINE}
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-6 sm:py-16 lg:px-11 lg:py-20">
        {/* two balanced columns: sidebar (title + eyebrow + small benefits) / content (description + cards) */}
        <div className="flex flex-col gap-10 sm:gap-14 lg:flex-row lg:gap-16">
          <div className="flex w-full flex-shrink-0 flex-col lg:w-[420px]">
            <span
              className="font-bebas block uppercase leading-[1.02] transition-all duration-700 ease-out"
              style={{
                color: WINE,
                fontSize: "clamp(2.6rem, 10vw, 4.4rem)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(18px)",
              }}
            >
              <span style={{ color: GOLD }}>02 — </span>
              {title}
            </span>

            <div
              className="mt-4 flex items-center gap-3 transition-all duration-700 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transitionDelay: "100ms",
              }}
            >
              <div
                className="h-px origin-left transition-transform duration-700 ease-out"
                style={{
                  width: 22,
                  backgroundColor: GOLD,
                  transform: visible ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: "150ms",
                }}
              />
            </div>

            <div
              className="mt-8 flex flex-col border-t sm:mt-10"
              style={{ borderColor: LINE }}
            >
              {small_benefit.map((benefit, i) => (
                <div
                  key={benefit}
                  className="group flex items-baseline gap-3 border-b py-4 transition-all duration-500 ease-out"
                  style={{
                    borderColor: LINE,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    transitionDelay: `${220 + i * 70}ms`,
                  }}
                >
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-[1.8]"
                    style={{ backgroundColor: BLUSH }}
                  />
                  <span className="font-open text-base font-semibold" style={{ color: WINE }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="font-open max-w-[660px] text-[16px] leading-[1.72] transition-all duration-700 ease-out sm:text-[17.5px] sm:leading-[1.7]"
              style={{
                color: INK_SOFT,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(18px)",
                transitionDelay: "160ms",
              }}
            >
              <RichText blocks={description} />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-9 sm:mt-12 sm:gap-y-12 sm:grid-cols-2">
              {big_benefit.map((benefit, index) => {
                const accent = ACCENTS[index % ACCENTS.length];
                const tint = ACCENT_TINTS[index % ACCENT_TINTS.length];
                return (
                  <div
                    key={benefit.title}
                    className="group relative pt-4 transition-all duration-500 ease-out hover:-translate-y-1"
                    style={{
                      opacity: visible ? 1 : 0,
                      // Dropped once revealed so the inline value stops shadowing
                      // the `hover:-translate-y-1` class (inline always wins).
                      transform: visible ? undefined : "translateY(24px)",
                      transitionDelay: `${300 + index * 110}ms`,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 h-[2px] origin-left transition-transform duration-700 ease-out"
                      style={{
                        width: "100%",
                        backgroundColor: accent,
                        transform: visible ? "scaleX(1)" : "scaleX(0)",
                        transitionDelay: `${300 + index * 110 + 150}ms`,
                      }}
                    />
                    <div
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: tint }}
                    >
                      <Image
                        {...GetImage(benefit.icon)}
                        height={26}
                        width={26}
                        alt={benefit.title}
                      />
                    </div>
                    <span
                      className="font-bebas mb-2 block text-3xl uppercase tracking-[0.02em]"
                      style={{ color: WINE }}
                    >
                      {benefit.title}
                    </span>
                    <p
                      className="font-open text-[15px] leading-[1.6]"
                      style={{ color: INK_SOFT }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="relative z-10 hidden justify-center pb-10 pt-2 transition-opacity duration-200 ease-out lg:flex"
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className="font-open text-[13px] uppercase tracking-[0.22em]"
            style={{ color: INK_SOFT }}
          >
            Görgess le
          </span>
          <div className="why-scroll-line relative h-[46px] w-px" style={{ backgroundColor: LINE }}>
            <div className="why-drop absolute left-[-1.5px] h-[18px] w-1 rounded-sm" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .why-drop {
          top: 0;
          background: linear-gradient(${GOLD}, transparent);
          animation: whyDropfall 2.4s ease-in-out infinite;
        }
        @keyframes whyDropfall {
          0% {
            transform: translateY(-18px);
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(46px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WhyApplicate;