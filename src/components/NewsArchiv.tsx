import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { isAfter, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { SanityArchiv, SanityNews } from "types";
import GetImage from "@utils/getImage";
import RichText from "@utils/RichText";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";
const INK_LIGHT = "rgba(255,255,255,0.5)";

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

const NewsArchiv = ({
  news,
  archivs,
}: {
  news: SanityNews[];
  archivs: SanityArchiv[];
}) => {
  const [openNewsDialog, setOpenNewsDialog] = useState(false);
  const [activeNews, setActiveNews] = useState<SanityNews>();
  const [scrollSectionRef, scrollCueRef] = useScrollFade<HTMLDivElement>();

  // Sort once per news-list change instead of on every render (this used to
  // re-parse every date on every scroll-triggered re-render — expensive).
  const sortedNews = useMemo(
    () => [...news].sort((a, b) => (isAfter(parseISO(b.date), parseISO(a.date)) ? 1 : -1)),
    [news]
  );

  return (
    <div
      ref={scrollSectionRef}
      style={{ backgroundColor: WINE }}
      className="relative flex w-full flex-col overflow-hidden px-5 pb-4 pt-14 sm:px-6 sm:pt-20 lg:px-11 lg:pt-24"
    >
      {/* thin decorative line-art, desktop only */}
      <svg
        className="pointer-events-none absolute -right-8 top-8 hidden w-[380px] opacity-55 lg:block"
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

      <div className="relative z-10 mx-auto w-full max-w-[1320px]">
        <div className="relative">
          <div id="hirek" className="absolute -top-[140px]" />
        </div>

        

        <h2
          className="font-bebas mb-10 mt-3 uppercase leading-[0.98] text-[#f4ece9]"
          style={{ fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 4rem)" }}
        >
          <span style={{ color: GOLD }}>05 — </span>Hírek
        </h2>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:mb-14 sm:gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {sortedNews
            .map((newElem, idx) => {
              const imageSettings = newElem.featuredImage
                ? GetImage(newElem.featuredImage)
                : undefined;
              return (
                !isAfter(parseISO(newElem.date), new Date()) && (
                  <div
                    key={newElem.name + idx}
                    className="group relative h-[250px] cursor-pointer overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.3)] sm:h-[300px]"
                    style={{ backgroundColor: "#1f0f1c" }}
                    onClick={() => {
                      setActiveNews(newElem);
                      setOpenNewsDialog(true);
                    }}
                  >
                    {imageSettings && (
                      <Image
                        loader={imageSettings.loader}
                        src={imageSettings.src}
                        fill
                        alt={`${newElem.name} kep`}
                        className="object-cover opacity-35"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(44,23,40,0) 0%, rgba(44,23,40,0.92) 75%)",
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                      <span
                        className="font-open mb-3 inline-block w-fit rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-[0.03em]"
                        style={{ backgroundColor: GOLD, color: WINE }}
                      >
                        {newElem.date}
                      </span>
                      <span
                        className="text-[15.5px] leading-[1.45] text-[#f4ece9] sm:text-[17px] sm:leading-[1.4]"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
                      >
                        {newElem.summary}
                      </span>
                    </div>
                  </div>
                )
              );
            })}
        </div>

        <div className="relative">
          <div id="archivum" className="absolute -top-[80px]" />
        </div>

        <div className="mb-8 h-px w-full sm:mb-10" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />

       

        <h2
          className="font-bebas mb-6 mt-3 uppercase leading-[0.98] text-[#f4ece9] sm:mb-8"
          style={{ fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 4rem)" }}
        >
          <span style={{ color: GOLD }}>06 — </span>Archívum
        </h2>

        <div className="mb-4 flex flex-wrap gap-2.5 sm:gap-3.5">
          {archivs.map((archivEl) => (
            <Link key={archivEl.year} href={`archivum/${archivEl.year}`}>
              <div
                className="font-bebas cursor-pointer rounded-full border px-6 py-3 text-[20px] tracking-[0.03em] transition-colors duration-250 ease-out sm:px-8 sm:py-3.5 sm:text-[22px]"
                style={{ borderColor: GOLD, color: GOLD }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD;
                  e.currentTarget.style.color = WINE;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = GOLD;
                }}
              >
                {archivEl.year}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="relative z-10 hidden justify-center pb-4 pt-0 transition-opacity duration-200 ease-out lg:flex"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="font-open text-[13px] uppercase tracking-[0.22em]" style={{ color: INK_LIGHT }}>
            Görgess le
          </span>
          <div className="na-scroll-line relative h-[46px] w-px bg-[rgba(255,255,255,0.15)]">
            <div className="na-drop absolute left-[-1.5px] h-[18px] w-1 rounded-sm" />
          </div>
        </div>
      </div>

      <Transition.Root show={openNewsDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpenNewsDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="relative flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className="relative max-h-[78vh] w-full transform overflow-x-hidden overflow-y-auto break-words rounded-2xl p-5 text-left shadow-xl transition-all sm:my-8 sm:max-h-[500px] sm:max-w-lg sm:p-6"
                  style={{ backgroundColor: "#f6efe6" }}
                >
                  {activeNews && (
                    <>
                      <Dialog.Title className="mb-4 flex justify-end">
                        <button className="cursor-pointer" style={{ color: WINE }}>
                          <XMarkIcon
                            className="h-7 w-7"
                            onClick={() => setOpenNewsDialog(false)}
                          />
                        </button>
                      </Dialog.Title>
                      <div className="prose max-w-none">
                        <RichText blocks={activeNews.description} />
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <style jsx>{`
        .na-drop {
          top: 0;
          background: linear-gradient(${GOLD}, transparent);
          animation: naDropfall 2.4s ease-in-out infinite;
        }
        @keyframes naDropfall {
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

export default NewsArchiv;