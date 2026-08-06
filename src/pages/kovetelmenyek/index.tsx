import { queryRequirement } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";

type Props = {
  requirement: SanityRichText[];
};

const Kovetelmenyek = ({ requirement }: Props) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col bg-lightGray px-6 pb-6 pt-[100px] text-black  md:px-10 md:pb-10 lg:bg-primaryLight ">
      <div className="text-justified h-full w-full lg:bg-lightGray lg:p-6">
        <div className="prose max-w-none">
          <RichText blocks={requirement} />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ preview = false }) {
  const general = await getClient(preview).fetch(queryRequirement);
  return {
    props: {
      requirement: general[0].requirement,
      preview,
    },
  };
}

export default Kovetelmenyek;
