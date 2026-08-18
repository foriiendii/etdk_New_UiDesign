import { queryActiveSections } from "@lib/queries";
import { getClient } from "@lib/sanity";
import GetImage from "@utils/getImage";
import { sortByHungarianName } from "@utils/sortByHungarianName";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import { SanityImage } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

const WINE = "var(--color-primary-dark, #2c1728)";

type SanitySectionPart = {
  _id: string;
  image?: SanityImage;
  name: string;
};

const MeghirdetettSzekciok = ({
  sections,
}: {
  sections: SanitySectionPart[];
}) => {
  return (
    <PageShell
      number="06"
      eyebrow="Aktuális kiadás"
      title="Meghirdetett szekciók"
    >
      {sections.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A szekciók listája még nem elérhető.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, idx) => {
            const imageSettings = section.image
              ? GetImage(section.image)
              : undefined;
            return (
              <div
                key={section._id ?? `${section.name}-${idx}`}
                className="group overflow-hidden rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(44,23,40,0.14)]"
                style={{
                  borderColor: "rgba(44,23,40,0.14)",
                  backgroundColor: "rgba(255,255,255,0.55)",
                }}
              >
                {imageSettings && (
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden"
                    style={{ backgroundColor: "rgba(44,23,40,0.06)" }}
                  >
                    <Image
                      loader={imageSettings.loader}
                      src={imageSettings.src}
                      alt={`${section.name} kép`}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={idx < 3}
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2
                    className="font-bebas text-[22px] uppercase leading-tight tracking-[0.02em] sm:text-[25px]"
                    style={{ color: WINE }}
                  >
                    {section.name}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  preview = false,
}) => {
  const [sections, themeColors] = await Promise.all([
    getClient(preview).fetch(queryActiveSections) as Promise<
      SanitySectionPart[]
    >,
    getThemeColors(preview),
  ]);

  return {
    props: {
      sections: sortByHungarianName(
        (sections ?? []).filter(
          (section) => section?._id && !section._id.includes("drafts")
        )
      ),
      themeColors,
      preview,
    },
  };
};

export default MeghirdetettSzekciok;
