import { useEffect, useRef, useState } from "react";
import type { SanityRichText } from "types";
import RichText from "@utils/RichText";
import LinkWrapper from "./UtilityComponents/LinkWrapper";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";
const LAVENDER = "#cdb8dd";

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

const ParticipationCondition = ({
  generalApplicationRules,
}: {
  generalApplicationRules: SanityRichText[];
}) => {
  const [sectionRef, visible] = useInView<HTMLDivElement>();
  const [scrollSectionRef, scrollCueRef] = useScrollFade<HTMLDivElement>();
  const setSectionNode = (node: HTMLDivElement | null) => {
    sectionRef.current = node;
    scrollSectionRef.current = node;
  };

  const conditions = [
    { text: "Szabályzat", link: "/szabalyzat" },
    { text: "Követelmények", link: "/kovetelmenyek" },
    { text: "Pontozási kritériumok", link: "/pontozasi-kriteriumok" },
    { text: "Letölthető dokumentumok", link: "/letoltheto-dokumentumok" },
  ];

  return (
    <div
      ref={setSectionNode}
      style={{ backgroundColor: WINE }}
      className="relative flex w-full flex-col overflow-hidden px-5 py-12 sm:px-6 sm:py-14 lg:h-[calc(100vh-80px)] lg:px-11 lg:py-10"
    >
      <div id="altalanos_tudnivalok" className="absolute -top-[80px]" />

      <span
        aria-hidden="true"
        className="font-bebas pointer-events-none absolute -right-10 -top-16 select-none text-[34vw] leading-none"
        style={{ color: "rgba(255,255,255,0.03)" }}
      >
        03
      </span>

      {/* thin decorative line-art, desktop only */}
      <svg
        className="pointer-events-none absolute -right-3 top-8 hidden w-[380px] opacity-55 lg:block"
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
        className="pointer-events-none absolute -left-12 bottom-2 hidden w-[420px] -scale-x-100 opacity-55 lg:block"
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

      <div className="relative z-10 flex flex-1 items-center">
      <div className="mx-auto w-full max-w-[1320px]">
        
        <h2
          className="font-bebas mb-2 mt-4 max-w-4xl uppercase leading-[0.98] text-[#f4ece9] transition-all duration-700 ease-out"
          style={{
            fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 4rem)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transitionDelay: "80ms",
          }}
        >
          <span style={{ color: GOLD }}>03 — </span>Általános részvételi
          {/* Hard break only from sm up: on phones the line is too long and the
              forced break pushed the heading into a ragged third line. */}
          <br className="hidden sm:block" /> feltételek
        </h2>

        

        <div className="flex flex-col gap-7 sm:gap-8 lg:flex-row lg:items-stretch lg:gap-16">
          <div
            className="font-open flex-[1.15] text-[16px] leading-[1.75] text-[rgba(255,255,255,0.7)] transition-all duration-700 ease-out sm:text-[17.5px] sm:leading-[1.85]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transitionDelay: "200ms",
            }}
          >
            <div className="prose prose-invert max-w-[560px]">
              <RichText blocks={generalApplicationRules} />
            </div>
          </div>

          <div
            className="flex flex-1 flex-col border-t"
            style={{
              borderColor: "rgba(255,255,255,0.14)",
              opacity: visible ? 1 : 0,
              // Shorthand must come before the longhand: React writes style keys in
              // object order, so a trailing `transition` would reset the delay to 0.
              transition: "opacity 0.7s ease-out",
              transitionDelay: "260ms",
            }}
          >
            {conditions.map((condition, i) => (
              <LinkWrapper key={condition.text} href={condition.link || "#"}>
                <div
                  className="group flex cursor-pointer items-center justify-between gap-4 border-b py-4 transition-all duration-300 ease-out hover:pl-2.5"
                  style={{ borderColor: "rgba(255,255,255,0.14)" }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-bebas text-[15px]" style={{ color: GOLD }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-bebas text-[24px] uppercase leading-tight tracking-[0.02em] text-[#f4ece9] transition-colors duration-300 group-hover:text-[var(--color-primary-light,#d4af6a)] sm:text-[28px]">
                      {condition.text}
                    </span>
                  </div>
                  <span
                    className="text-xl transition-all duration-300 ease-out group-hover:translate-x-1"
                    style={{ color: BLUSH }}
                  >
                    →
                  </span>
                </div>
              </LinkWrapper>
            ))}
          </div>
        </div>
      </div>
      </div>

      <div
        ref={scrollCueRef}
        className="relative z-10 hidden justify-center pb-2 pt-6 transition-opacity duration-200 ease-out lg:flex"
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className="font-open text-[13px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Görgess le
          </span>
          <div className="pc-scroll-line relative h-[46px] w-px bg-[rgba(255,255,255,0.15)]">
            <div className="pc-drop absolute left-[-1.5px] h-[18px] w-1 rounded-sm" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .pc-drop {
          top: 0;
          background: linear-gradient(${GOLD}, transparent);
          animation: pcDropfall 2.4s ease-in-out infinite;
        }
        @keyframes pcDropfall {
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

export default ParticipationCondition;