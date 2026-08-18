import { queryGeneralRules } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

type Props = {
  rules: SanityRichText[];
};

const Szabalyzat = ({ rules }: Props) => {
  return (
    <PageShell
      number="01"
      eyebrow="Általános tudnivalók"
      title="Szabályzat"
    >
      {rules.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A szabályzat jelenleg nem elérhető.
        </p>
      ) : (
        <div className="prose prose-neutral max-w-none">
          <RichText blocks={rules} />
        </div>
      )}
    </PageShell>
  );
};

export async function getServerSideProps({ preview = false }) {
  const [generals, themeColors] = await Promise.all([
    getClient(preview).fetch(queryGeneralRules),
    getThemeColors(preview),
  ]);

  return {
    props: {
      rules: generals?.[0]?.rules ?? [],
      themeColors,
      preview,
    },
  };
}

export default Szabalyzat;
