import { querySchedule } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

type Props = {
  schedule: SanityRichText[];
};

const Program = ({ schedule }: Props) => {
  return (
    <PageShell
      number="03"
      eyebrow="Aktuális kiadás"
      title="Program"
    >
      {schedule.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A program még nem elérhető.
        </p>
      ) : (
        <div className="prose prose-neutral max-w-none">
          <RichText blocks={schedule} />
        </div>
      )}
    </PageShell>
  );
};

export async function getServerSideProps({ preview = false }) {
  const [general, themeColors] = await Promise.all([
    getClient(preview).fetch(querySchedule),
    getThemeColors(preview),
  ]);

  return {
    props: {
      schedule: general?.[0]?.schedule ?? [],
      themeColors,
      preview,
    },
  };
}

export default Program;
