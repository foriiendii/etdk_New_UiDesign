import { queryArhivDetails } from "@lib/queries";
import { getClient } from "@lib/sanity";
import GetImage from "@utils/getImage";
import classNames from "classnames";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SanityArchiv } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";

const SectionHeading = ({ children }: { children: string }) => (
  <div className="mb-6 flex items-center gap-3">
    <span className="h-px w-[22px] shrink-0" style={{ backgroundColor: GOLD }} />
    <h2
      className="font-bebas text-[26px] uppercase leading-tight tracking-[0.02em] sm:text-[32px]"
      style={{ color: WINE }}
    >
      {children}
    </h2>
  </div>
);

const Archivum = ({
  archivData,
  year,
}: {
  archivData: SanityArchiv | null;
  year: string;
}) => {
  const imageSettings = archivData?.book_image
    ? GetImage(archivData.book_image)
    : undefined;

  const hasWinners = Boolean(archivData?.winners?.length);

  return (
    <PageShell
      // `queryArhivDetails` doesn't select `year`, so it comes from the route slug.
      number={year}
      eyebrow="Archívum"
      title="Korábbi kiadás"
    >
      {(!archivData || (!imageSettings && !hasWinners)) && (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          Ehhez az évhez még nincs archivált tartalom.
        </p>
      )}

      {archivData && imageSettings && (
        <section className="mb-14">
          <SectionHeading>Kivonatos füzet</SectionHeading>
          <Link
            href={archivData.book || ""}
            target="_blank"
            rel="noreferrer"
            className={classNames(
              "group block w-full max-w-[560px] overflow-hidden rounded-2xl border transition-all duration-300 ease-out",
              archivData.book
                ? "hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(44,23,40,0.16)]"
                : "pointer-events-none"
            )}
            style={{ borderColor: "rgba(44,23,40,0.14)" }}
          >
            <Image
              loader={imageSettings.loader}
              src={imageSettings.src}
              height={563}
              width={801}
              alt={`${year} kivonatos füzet`}
              className="h-auto w-full object-cover"
              sizes="(max-width: 640px) 100vw, 560px"
              priority
            />
          </Link>
        </section>
      )}

      {hasWinners && (
        <section>
          <SectionHeading>Díjazottak</SectionHeading>
          <WinnersBySection winners={archivData!.winners} />
        </section>
      )}
    </PageShell>
  );
};

// Lets the visitor pick one section and only shows that section's winners,
// instead of dumping every section's list on the page at once.
const WinnersBySection = ({
  winners,
}: {
  winners: NonNullable<SanityArchiv["winners"]>;
}) => {
  const sectionNames = useMemo(
    () =>
      Array.from(
        new Set(winners.map((winner) => winner.section?.name).filter(Boolean))
      ) as string[],
    [winners]
  );
  const [selectedSection, setSelectedSection] = useState(sectionNames[0] || "");
  const visibleWinners = winners.filter(
    (winner) => winner.section?.name === selectedSection
  );

  return (
    <div>
      {sectionNames.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2.5">
          {sectionNames.map((name) => {
            const active = name === selectedSection;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedSection(name)}
                className="font-open rounded-full border px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.04em] transition-all duration-200"
                style={
                  active
                    ? { borderColor: WINE, backgroundColor: WINE, color: "#f4ece9" }
                    : { borderColor: "rgba(44,23,40,0.18)", color: WINE }
                }
              >
                {name}
              </button>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-1 gap-5">
        {visibleWinners.map((winner, wi) => (
          <div
            key={`${winner.section?.name ?? "szekcio"}-${wi}`}
            className="rounded-2xl border p-5 sm:p-6"
            style={{
              borderColor: "rgba(44,23,40,0.14)",
              backgroundColor: "rgba(255,255,255,0.55)",
            }}
          >
            <h3
              className="font-bebas mb-4 border-b pb-3 text-[22px] uppercase leading-tight tracking-[0.02em] sm:text-[26px]"
              style={{ color: WINE, borderColor: "rgba(44,23,40,0.12)" }}
            >
              {winner.section.name}
            </h3>
            <ul className="flex flex-col gap-3.5">
              {winner.winnerPersons.map((person) => (
                <li key={person.name} className="flex flex-col gap-1">
                  <span
                    className="font-open text-[11px] uppercase tracking-[0.16em]"
                    style={{ color: GOLD }}
                  >
                    {person.result}
                  </span>
                  <span
                    className="font-open whitespace-pre-wrap text-[15.5px] leading-snug sm:text-[16.5px]"
                    style={{ color: "#4a3a44" }}
                  >
                    {person.name.split(",").join(",\n")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  preview = false,
  params,
}) => {
  const [archivData, themeColors] = await Promise.all([
    getClient(preview).fetch(queryArhivDetails(params?.slug as string)),
    getThemeColors(preview),
  ]);

  return {
    props: {
      archivData: archivData?.[0] ?? null,
      year: (params?.slug as string) ?? "",
      themeColors,
      preview,
    },
  };
};

export default Archivum;
