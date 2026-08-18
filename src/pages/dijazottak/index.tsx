import { queryWinners } from "@lib/queries";
import { getClient } from "@lib/sanity";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";

type WinnersType = {
  section: {
    name: string;
  } | null;
  winnerPersons:
    | {
        name: string;
        result: string;
      }[]
    | null;
};

const Winners = ({ winners }: { winners: WinnersType[] }) => {
  return (
    <PageShell
      number="04"
      eyebrow="Aktuális kiadás"
      title="Díjazottak"
    >
      {winners.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A díjazottak listája még nem elérhető.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {winners.map((winner, wi) => (
            <div
              key={`${winner.section?.name ?? "szekcio"}-${wi}`}
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
                {winner.section?.name ?? "Szekció"}
              </h2>
              <ul className="flex flex-col gap-3.5">
                {(winner.winnerPersons ?? []).map((person, pi) => (
                  <li key={`${person.name}-${pi}`} className="flex flex-col gap-1">
                    {person.result && (
                      <span
                        className="font-open text-[11px] uppercase tracking-[0.16em]"
                        style={{ color: GOLD }}
                      >
                        {person.result}
                      </span>
                    )}
                    <span
                      className="font-open whitespace-pre-wrap text-[15.5px] leading-snug sm:text-[16.5px]"
                      style={{ color: "#4a3a44" }}
                    >
                      {(person.name ?? "").split(",").join(",\n")}
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

export const getServerSideProps = async ({ preview = false }) => {
  const [winners, themeColors] = await Promise.all([
    getClient(preview).fetch(queryWinners) as Promise<WinnersType[]>,
    getThemeColors(preview),
  ]);

  // Copy before sorting: `fetch` hands back its own array, and a dangling
  // section reference in Sanity makes `section` null, so sort defensively.
  const sorted = [...(winners ?? [])].sort((a, b) =>
    (a.section?.name ?? "")
      .toLowerCase()
      .localeCompare((b.section?.name ?? "").toLowerCase())
  );

  return {
    props: {
      winners: sorted,
      themeColors,
      preview,
    },
  };
};

export default Winners;
