import { queryScoringCriteria } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

type Props = {
  scoringcriteria: SanityRichText[];
};

const PontozasiKriteriumok = ({ scoringcriteria }: Props) => {
  return (
    <PageShell
      number="03"
      eyebrow="Általános tudnivalók"
      title="Pontozási kritériumok"
    >
      {scoringcriteria.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A pontozási kritériumok jelenleg nem elérhetőek.
        </p>
      ) : (
        <div className="prose prose-neutral max-w-none">
          <RichText blocks={scoringcriteria} />
        </div>
      )}
    </PageShell>
  );
};

export async function getServerSideProps({ preview = false }) {
  const [general, themeColors] = await Promise.all([
    getClient(preview).fetch(queryScoringCriteria),
    getThemeColors(preview),
  ]);

  return {
    props: {
      scoringcriteria: general?.[0]?.scoringcriteria ?? [],
      themeColors,
      preview,
    },
  };
}

export default PontozasiKriteriumok;
