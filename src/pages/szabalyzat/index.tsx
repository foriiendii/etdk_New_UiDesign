import { queryGeneralRules } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityGeneral } from "types";

type Props = {
  general: SanityGeneral;
};

const Szabalyzat = ({ general }: Props) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col bg-lightGray px-6 pb-6 pt-[100px] md:px-10 md:pb-10 lg:bg-primaryLight">
      <div className="h-full w-full lg:bg-lightGray lg:p-6">
        <div className="prose max-w-none">
          <RichText blocks={general.rules} />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ preview = false }) {
  const generals = await getClient(preview).fetch(queryGeneralRules);
  return {
    props: {
      general: generals[0],
      preview,
    },
  };
}

export default Szabalyzat;
