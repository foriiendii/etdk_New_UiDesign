import { queryDeadline } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

type Props = {
  deadline: SanityRichText[];
};

const Hataridok = ({ deadline }: Props) => {
  return (
    <PageShell
      number="01"
      eyebrow="Aktuális kiadás"
      title="Határidők"
    >
      {deadline.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A határidők még nem elérhetőek.
        </p>
      ) : (
        <div className="prose prose-neutral max-w-none">
          <RichText blocks={deadline} />
        </div>
      )}
    </PageShell>
  );
};

export async function getServerSideProps({ preview = false }) {
  const [deadlines, themeColors] = await Promise.all([
    getClient(preview).fetch(queryDeadline),
    getThemeColors(preview),
  ]);

  return {
    props: {
      deadline: deadlines?.[0]?.deadline ?? [],
      themeColors,
      preview,
    },
  };
}

export default Hataridok;
