import Image from "next/image";
import React from "react";
import GetImage from "@utils/getImage";
import type { SanityOrganizer, SanitySponsor } from "types";

type Props = {
  sponsors: SanitySponsor[];
  organizers: SanityOrganizer[];
};

const SponsorsOrg = ({ sponsors, organizers }: Props) => {
  return (
    <div className="relative flex min-h-[calc(100vh-71px)] w-full flex-col items-center justify-center gap-12 bg-lightGray py-8 px-4 lg:bg-white">
      <div id="tamogatok" className="absolute -top-[70px]" />
      <div className="w-full">
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <div>
            <span className="text-7xl text-primaryLight">Támogatók</span>
          </div>
          <div className="flex flex-col flex-wrap items-center justify-evenly gap-24 sm:flex-row">
            {sponsors.map((sponsor) => {
              const imageSettings = GetImage(sponsor.image);
              if (!imageSettings) {
                return <div key="error">Error loading image...</div>;
              }
              const ratio = imageSettings.width / imageSettings.height;
              return (
                <div key={sponsor.name} className="relative">
                  <Image
                    loader={imageSettings.loader}
                    src={imageSettings.src}
                    alt="image"
                    height={120}
                    width={parseInt((120 * ratio).toFixed())}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <div>
          <span className="text-7xl text-primaryLight">Szervezők</span>
        </div>
        <div className="flex flex-col flex-wrap items-center justify-evenly gap-24 sm:flex-row">
          {organizers.map((organizer) => {
            const imageSettings = GetImage(organizer.image);
            if (!imageSettings) {
              return <div key="error">Error loading image...</div>;
            }
            const ratio = imageSettings.width / imageSettings.height;
            return (
              <Image
                key={organizer.name}
                loader={imageSettings.loader}
                src={imageSettings.src}
                alt="image"
                height={120}
                width={parseInt((120 * ratio).toFixed())}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SponsorsOrg;
