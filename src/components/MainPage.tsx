import Image from "next/image";
import { useEffect, useRef } from "react";
import MainPageLogoCrop from "../../public/mainpagelogocrop.png";
import MainPageLogo from "../../public/mainpagelogo.png";

type Props = {
  date: string;
  edition: string;
  romanEdition: string;
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

const MainPage = ({ date, edition, romanEdition }: Props) => {
  const [scrollSectionRef, scrollCueRef] = useScrollFade<HTMLDivElement>();

  return (
    <div
      ref={scrollSectionRef}
      className="min-h-screen-safe relative flex min-w-full flex-col overflow-hidden pt-[80px]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 800px 600px at 85% 20%, rgba(231,169,180,0.16), transparent 60%), radial-gradient(ellipse 600px 500px at 10% 90%, rgba(205,184,221,0.10), transparent 60%)",
        backgroundColor: "var(--color-primary-dark, #2c1728)",
      }}
    >
      <div id="general" className="absolute -top-[80px]" />

      {/* thin decorative line-art, desktop only */}
      <svg
        className="pointer-events-none absolute -right-5 top-10 hidden w-[380px] opacity-50 lg:block"
        viewBox="0 0 400 200"
        fill="none"
      >
        <path
          d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
          stroke="var(--color-primary-light, #d4af6a)"
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
          stroke="var(--color-secondary, #e7a9b4)"
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -left-10 bottom-0 hidden w-[420px] -scale-x-100 opacity-50 lg:block"
        viewBox="0 0 400 200"
        fill="none"
      >
        <path
          d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
          stroke="#cdb8dd"
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
          stroke="var(--color-primary-light, #d4af6a)"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>

      {/* logo, "wall-mounted" flush to the left edge — desktop only */}
      <div className="logo-slide pointer-events-none absolute left-[-36px] top-1/2 hidden w-[320px] -translate-y-1/2 lg:block">
        <Image
          src={MainPageLogoCrop}
          alt="ETDK / KMDSZ logo"
          priority
          className="h-auto w-full"
        />
      </div>

      {/* Mobile echo of the desktop "wall-mounted" logo: a large, very faint crop
          bleeding off the bottom-right corner, giving the phone hero the same
          sense of scale the desktop gets from the full-size logo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 -right-24 w-[330px] select-none opacity-[0.07] lg:hidden"
      >
        <Image src={MainPageLogoCrop} alt="" className="h-auto w-full" />
      </div>

      <div className="relative z-10 flex flex-1 items-center">
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-10 pt-2 sm:px-6 sm:py-8 lg:px-11 lg:pl-[300px]">
        {/* Mobile logo, left-aligned to share the text's optical margin instead of
            fighting it from the centre. The rule carries the eye off to the right. */}
        <div className="mb-7 flex items-center gap-4 lg:hidden">
          <div
            className="logo-drop relative shrink-0"
            style={{
              width: "clamp(72px, 21vw, 104px)",
              height: "clamp(72px, 21vw, 104px)",
            }}
          >
            <Image
              src={MainPageLogo}
              alt="ETDK / KMDSZ logo"
              fill
              priority
              sizes="104px"
            />
          </div>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, var(--color-primary-light, #d4af6a), rgba(212,175,106,0))",
            }}
          />
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="h-px w-4 shrink-0 sm:w-[22px]" style={{ backgroundColor: "var(--color-primary-light, #d4af6a)" }} />
          <span className="font-open text-[11px] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.65)] sm:text-sm sm:tracking-[0.16em]">
            Kolozsvár // Cluj-Napoca — {date || ""}
          </span>
        </div>

        <h1
          className="font-bebas mt-4 max-w-3xl uppercase leading-[1.02] text-[#f6efec] sm:mt-6"
          style={{ fontSize: "clamp(2.75rem, 1.6rem + 5.2vw, 5.6rem)" }}
        >
          <span style={{ color: "var(--color-secondary, #e7a9b4)" }}>{romanEdition}.</span> Erdélyi
          Tudományos
          <br />
          Diákköri Konferencia
        </h1>

        <div
          className="mt-3 max-w-xl italic sm:mt-4"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            // Was text-2xl / sm:text-4xl / lg:text-[2.6vw], which shrank from 36px
            // back to ~27px at the lg breakpoint.
            fontSize: "clamp(1.5rem, 0.9rem + 1.9vw, 3.4rem)",
            color: "var(--color-primary-light, #d4af6a)",
          }}
        >
          Reál és humántudományok
        </div>

        <div className="mt-6 flex max-w-xl flex-col gap-1.5 sm:mt-8">
          <span className="font-open text-[13px] leading-snug text-[rgba(255,255,255,0.6)] sm:text-base">
            {`Conferința științifică studențească din Transilvania, ediția a ${
              edition.slice(0, 2) || ""
            }-a`}
          </span>
          <span className="font-open text-[13px] leading-snug text-[rgba(255,255,255,0.6)] sm:text-base">
            {`${edition || ""} Transylvanian students' scientific conference`}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-7">
          <span
            className="font-open text-[11px] uppercase tracking-[0.12em] sm:text-[13px] sm:tracking-[0.14em]"
            style={{ color: "var(--color-secondary, #e7a9b4)" }}
          >
            Științe reale și umaniste
          </span>
          <div className="hidden h-3 w-px bg-[rgba(255,255,255,0.2)] sm:block" />
          <span
            className="font-open text-[11px] uppercase tracking-[0.12em] sm:text-[13px] sm:tracking-[0.14em]"
            style={{ color: "var(--color-primary-light, #d4af6a)" }}
          >
            Formal and empirical sciences
          </span>
        </div>
      </div>
      </div>

      <div
        ref={scrollCueRef}
        className="relative z-10 flex justify-center pb-7 transition-opacity duration-200 ease-out sm:pb-8"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="font-open text-[13px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.5)]">
            Görgess le
          </span>
          <div className="scroll-line relative h-[46px] w-px bg-[rgba(255,255,255,0.15)]">
            <div className="drop absolute left-[-1.5px] h-[18px] w-1 rounded-sm" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-slide :global(img) {
          animation: slideInLeft 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.15s;
        }
        .logo-drop {
          animation: logoRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.1s;
        }
        @keyframes logoRise {
          from {
            transform: translateY(14px) scale(0.94);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-slide :global(img),
          .logo-drop,
          .drop {
            animation: none;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-160%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .drop {
          top: 0;
          background: linear-gradient(var(--color-primary-light, #d4af6a), transparent);
          animation: dropfall 2.4s ease-in-out infinite;
        }
        @keyframes dropfall {
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

export default MainPage;