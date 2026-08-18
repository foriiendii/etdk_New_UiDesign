import { useEffect, useRef, useState } from "react";
import LinkWrapper from "./UtilityComponents/LinkWrapper";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";
const CREAM = "#f6efe6";
const INK_SOFT = "#6b5a63";
const LAVENDER = "#cdb8dd";
const CARD_BG = "color-mix(in srgb, var(--color-primary-dark, #2c1728) 90%, transparent)";

type YearProps = {
  paymentLink?: string;
};

const yearElements = [
  { text: "Határidők", link: "/hataridok" },
  { text: "Zsűrik", link: "/zsurik" },
  { text: "Program", link: "/program" },
  { text: "Díjazottak", link: "/dijazottak" },
  { text: "Előadások és workshopok" },
  { text: "Meghírdetett szekciók", link: "/meghirdetett-szekciok" },
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

const Year = ({ paymentLink }: YearProps) => {
  const [sectionRef, visible] = useInView<HTMLDivElement>();
  const [scrollSectionRef, scrollCueRef] = useScrollFade<HTMLDivElement>();
  const setSectionNode = (node: HTMLDivElement | null) => {
    sectionRef.current = node;
    scrollSectionRef.current = node;
  };

  const allElements = [
    ...yearElements,
    ...(paymentLink ? [{ text: "Befizetés", link: paymentLink }] : []),
  ];

  return (
    <div
      ref={setSectionNode}
      style={{ backgroundColor: CREAM }}
      className="relative flex w-full flex-col items-center overflow-hidden px-5 py-12 text-center sm:px-6 sm:py-14 lg:h-[calc(100vh-80px)] lg:px-11 lg:py-10"
    >
      <div id="aktualis_ev" className="absolute -top-[80px]" />

      <span
        aria-hidden="true"
        className="font-bebas pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[42vw] leading-none"
        style={{ color: "rgba(44,23,40,0.035)" }}
      >
        {new Date().getFullYear()}
      </span>

      {/* thin decorative line-art, desktop only */}
      <svg
        className="pointer-events-none absolute -left-16 top-5 hidden w-[340px] opacity-60 lg:block"
        viewBox="0 0 400 200"
        fill="none"
      >
        <path
          d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
          stroke={LAVENDER}
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
          stroke={GOLD}
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -right-10 bottom-8 hidden w-[380px] -scale-x-100 opacity-60 lg:block"
        viewBox="0 0 400 200"
        fill="none"
      >
        <path
          d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
          stroke={GOLD}
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
          stroke={BLUSH}
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <div
          className="font-bebas relative z-10 leading-[0.9] transition-all duration-700 ease-out"
          style={{
            fontSize: "clamp(4.5rem, 2rem + 14vw, 11rem)",
            color: WINE,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transitionDelay: "80ms",
          }}
        >
          {new Date().getFullYear()}
        </div>


      <div
        className="relative z-10 mt-8 grid w-full max-w-[1100px] grid-cols-1 gap-3 transition-all duration-700 ease-out sm:mt-12 sm:gap-[18px] sm:grid-cols-2 lg:grid-cols-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transitionDelay: "200ms",
        }}
      >
        {allElements.map((element) =>
          element.link ? (
            <LinkWrapper key={element.text} href={element.link}>
              <div
                className="group flex cursor-pointer items-center justify-between gap-3.5 rounded-[14px] border px-5 py-[18px] text-left sm:px-6 sm:py-[22px] transition-all duration-300 ease-out hover:-translate-y-[3px]"
                style={{
                  borderColor: WINE,
                  backgroundColor: CARD_BG,
                  boxShadow: "0 8px 22px rgba(44,23,40,0.13)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = WINE;
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(44,23,40,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = CARD_BG;
                  e.currentTarget.style.boxShadow = "0 8px 22px rgba(44,23,40,0.13)";
                }}
              >
                <span className="flex items-baseline">
                  <span
                    className="font-bebas mr-3.5 text-[13px]"
                    style={{ color: GOLD }}
                  >
                    {String(allElements.indexOf(element) + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-open text-[17.5px] font-semibold"
                    style={{ color: "#f4ece9" }}
                  >
                    {element.text}
                  </span>
                </span>
                <span
                  className="text-base transition-all duration-300 ease-out group-hover:translate-x-[3px]"
                  style={{ color: BLUSH }}
                >
                  →
                </span>
              </div>
            </LinkWrapper>
          ) : (
            <div
              key={element.text}
              className="flex items-center justify-between gap-3.5 rounded-[14px] border px-5 py-[18px] text-left sm:px-6 sm:py-[22px] opacity-40"
              style={{
                borderColor: WINE,
                backgroundColor: "color-mix(in srgb, var(--color-primary-dark, #2c1728) 45%, transparent)",
              }}
            >
              <span className="flex items-baseline">
                <span className="font-bebas mr-3.5 text-[13px]" style={{ color: GOLD }}>
                  {String(allElements.indexOf(element) + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-open text-[17.5px] font-semibold"
                  style={{ color: "#f4ece9" }}
                >
                  {element.text}
                </span>
              </span>
            </div>
          )
        )}
      </div>
      </div>

      <div
        ref={scrollCueRef}
        className="relative z-10 hidden justify-center pb-2 pt-6 transition-opacity duration-200 ease-out lg:flex"
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className="font-open text-[13px] uppercase tracking-[0.22em]"
            style={{ color: INK_SOFT }}
          >
            Görgess le
          </span>
          <div className="year-scroll-line relative h-[46px] w-px" style={{ backgroundColor: "rgba(44,23,40,0.14)" }}>
            <div className="year-drop absolute left-[-1.5px] h-[18px] w-1 rounded-sm" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .year-drop {
          top: 0;
          background: linear-gradient(${GOLD}, transparent);
          animation: yearDropfall 2.4s ease-in-out infinite;
        }
        @keyframes yearDropfall {
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

export default Year;