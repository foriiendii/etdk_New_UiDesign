import Image from "next/image";
import GetImage from "@utils/getImage";
import type { SanitySponsor } from "types";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";
const LAVENDER = "#cdb8dd";
const INK_SOFT = "#6b5a63";
const CREAM = "#f6efe6";

type Props = {
  sponsors: SanitySponsor[];
};

const SponsorsOrg = ({ sponsors }: Props) => {
  return (
    <div
      style={{ backgroundColor: CREAM }}
      className="relative flex w-full flex-col overflow-hidden px-5 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-11 lg:pt-24"
    >
      <div className="relative">
        <div id="tamogatok" className="absolute -top-[110px]" />
      </div>

      {/* thin decorative line-art, desktop only */}
      <svg
        className="pointer-events-none absolute -right-8 top-8 hidden w-[360px] opacity-55 lg:block"
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
          stroke={LAVENDER}
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1320px]">
        

        <h2
          className="font-bebas mb-8 mt-3 uppercase leading-[0.98] text-[#2c1728] sm:mb-11"
          style={{ fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 4rem)" }}
        >
          <span style={{ color: BLUSH }}>07 — </span>Támogatók
        </h2>

        <div className="mb-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-8 sm:mb-20 sm:gap-x-10 sm:gap-y-10 lg:gap-12">
          {sponsors.map((sponsor) => {
            const imageSettings = GetImage(sponsor.image);
            if (!imageSettings) {
              return <div key="error">Error loading image...</div>;
            }
            // Sanity assets occasionally arrive without dimension metadata, which
            // would make `ratio` NaN and crash next/image on an invalid width.
            const rawRatio = imageSettings.width / imageSettings.height;
            // Clamp so an unusually wide or unusually narrow uploaded logo doesn't
            // visually dominate/shrink next to the others - everyone gets the same
            // height and a bounded footprint either way (logo size normalization).
            const safeRatio = Number.isFinite(rawRatio) && rawRatio > 0 ? rawRatio : 3;
            const ratio = Math.min(Math.max(safeRatio, 0.7), 2.8);
            return (
              <div
                key={sponsor.name}
                className="relative flex h-[52px] w-[42vw] max-w-[130px] items-center justify-center opacity-55 grayscale transition-all duration-300 ease-out hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0 sm:h-[62px] sm:w-auto sm:max-w-[170px] lg:h-[70px] lg:max-w-[190px]"
              >
                <Image
                  loader={imageSettings.loader}
                  src={imageSettings.src}
                  alt={sponsor.name || "sponsor"}
                  height={70}
                  width={parseInt((70 * ratio).toFixed())}
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SponsorsOrg;