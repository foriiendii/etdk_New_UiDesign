import { queryRequirement } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

type Props = {
  requirement: SanityRichText[];
};

const Kovetelmenyek = ({ requirement }: Props) => {
  return (
    <PageShell
      number="02"
      eyebrow="Általános tudnivalók"
      title="Követelmények"
    >
      {requirement.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A követelmények jelenleg nem elérhetőek.
        </p>
      ) : (
        <div className="prose prose-neutral max-w-none">
          <RichText blocks={requirement} />
        </div>
      )}
    </PageShell>
  );
};

export async function getServerSideProps({ preview = false }) {
  const [general, themeColors] = await Promise.all([
    getClient(preview).fetch(queryRequirement),
    getThemeColors(preview),
  ]);

  return {
    props: {
      requirement: general?.[0]?.requirement ?? [],
      themeColors,
      preview,
    },
  };
}

export default Kovetelmenyek;
