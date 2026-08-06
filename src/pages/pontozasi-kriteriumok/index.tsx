import { queryScoringCriteria } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";

type Props = {
  scoringcriteria: SanityRichText[];
};

const PontozasiKriteriumok = ({ scoringcriteria }: Props) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col bg-lightGray px-6 pb-6 pt-[100px] text-black  md:px-10 md:pb-10 lg:bg-primaryLight ">
      <div className="text-justified h-full w-full lg:bg-lightGray lg:p-6">
        <div className="prose max-w-none">
          <RichText blocks={scoringcriteria} />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ preview = false }) {
  const general = await getClient(preview).fetch(queryScoringCriteria);
  return {
    props: {
      scoringcriteria: general[0].scoringcriteria,
      preview,
    },
  };
}

export default PontozasiKriteriumok;
