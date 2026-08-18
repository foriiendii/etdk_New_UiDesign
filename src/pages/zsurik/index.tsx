import { querySectionScorers } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { sortByHungarianName } from "@utils/sortByHungarianName";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";

type Section = {
  name: string;
  scorers: { name: string }[];
};

type Props = {
  sections: Section[];
};

const Zsurik = ({ sections }: Props) => {
  return (
    <PageShell
      number="02"
      eyebrow="Aktuális kiadás"
      title="Zsűrik"
    >
      {sections.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A zsűrik összetétele még nem elérhető.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {sections.map((section, si) => (
            <div
              key={`${section.name}-${si}`}
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                borderColor: "rgba(44,23,40,0.14)",
                backgroundColor: "rgba(255,255,255,0.55)",
              }}
            >
              <h2
                className="font-bebas mb-4 border-b pb-3 text-[24px] uppercase leading-tight tracking-[0.02em] sm:text-[28px]"
                style={{ color: WINE, borderColor: "rgba(44,23,40,0.12)" }}
              >
                {section.name}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {(section.scorers || [])
                  .filter((scorer) => scorer?.name)
                  .map((scorer, i) => (
                  <li key={`${scorer.name}-${i}`} className="flex items-baseline gap-3">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: GOLD }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-open whitespace-pre-wrap text-[15.5px] leading-snug sm:text-[16.5px]"
                      style={{ color: "#4a3a44" }}
                    >
                      {scorer.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export async function getServerSideProps({ preview = false }) {
  const [sections, themeColors] = await Promise.all([
    getClient(preview).fetch(querySectionScorers) as Promise<Section[]>,
    getThemeColors(preview),
  ]);

  return {
    props: {
      sections: sortByHungarianName((sections ?? []).filter((s) => s?.name)),
      themeColors,
      preview,
    },
  };
}

export default Zsurik;
