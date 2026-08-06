import RichText from "@utils/RichText";
import Image from "next/image";
import type { SanityRichText } from "types";
import LinkWrapper from "./UtilityComponents/LinkWrapper";
import Illusztracio2 from "../../public/illusztracio2.png";

const ParticipationCondition = ({
  generalApplicationRules,
}: {
  generalApplicationRules: SanityRichText[];
}) => {
  const conditions = [
    { text: "Szabályzat", link: "/szabalyzat" },
    { text: "Követelmények", link: "/kovetelmenyek" },
    { text: "Pontozási kritériumok", link: "/pontozasi-kriteriumok" },
    {
      text: "Letölthető dokumentumok",
      link: "/letoltheto-dokumentumok",
    },
  ];
  return (
    <div className="relative flex min-h-[calc(100vh-71px)] w-full flex-col bg-grayCustom px-8 pt-14">
      <div id="altalanos_tudnivalok" className="absolute -top-[70px]" />
      <div className="flex w-full justify-center">
        <span className="text-center text-3xl text-white sm:text-6xl lg:text-8xl">
          Általános részvételi feltételek
        </span>
      </div>
      <div className="mt-8 flex min-h-[70vh] flex-col sm:flex-row">
        <div className="flex min-h-full justify-end sm:w-3/5">
          <div className="pr-4 lg:w-3/4">
            <div className="prose max-w-none text-justify text-lg text-white ">
              <RichText blocks={generalApplicationRules} />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:mt-0 sm:w-2/5">
          <div className="flex w-full flex-col items-center gap-4">
            {conditions.map((condition) => (
              <LinkWrapper key={condition.text} href={condition.link || "#"}>
                <div className="min-w-max cursor-pointer rounded-2xl bg-white py-2 px-2 text-center text-3xl tracking-wide text-primaryLight">
                  <span>{condition.text}</span>
                </div>
              </LinkWrapper>
            ))}
          </div>
          <div className="relative mt-10 h-[60vw] w-[82vw] sm:h-[25vw] sm:w-[40vw] lg:aspect-auto lg:max-h-[380px] lg:w-[35vw] lg:max-w-[530px]">
            <Image src={Illusztracio2} alt="illusztracio" fill />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationCondition;
