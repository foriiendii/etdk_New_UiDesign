import { queryFiles } from "@lib/queries";
import { getClient } from "@lib/sanity";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";

type Props = {
  files: {
    url: string;
    name: string;
  }[];
};

const LetolthetoDokumentumok = ({ files }: Props) => {
  return (
    <PageShell
      number="04"
      eyebrow="Általános tudnivalók"
      title="Letölthető dokumentumok"
    >
      {files && files.length > 0 ? (
        <div className="flex flex-col border-t" style={{ borderColor: "rgba(44,23,40,0.14)" }}>
          {files.map((file, i) => (
            <a
              key={`${file.name}-${i}`}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between gap-4 border-b py-4 no-underline transition-all duration-300 ease-out hover:pl-2.5"
              style={{ borderColor: "rgba(44,23,40,0.14)" }}
            >
              <span className="flex min-w-0 items-baseline gap-4">
                <span className="font-bebas shrink-0 text-[15px]" style={{ color: GOLD }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-open break-words text-[15.5px] font-semibold transition-colors duration-300 sm:text-[17px]"
                  style={{ color: WINE }}
                >
                  {file.name}
                </span>
              </span>
              <span
                className="font-open shrink-0 text-xl transition-transform duration-300 ease-out group-hover:translate-y-0.5"
                style={{ color: BLUSH }}
                aria-hidden="true"
              >
                ↓
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          Jelenleg nincsenek letölthető dokumentumok.
        </p>
      )}
    </PageShell>
  );
};

export async function getServerSideProps({ preview = false }) {
  const [files, themeColors] = await Promise.all([
    getClient(preview).fetch(queryFiles),
    getThemeColors(preview),
  ]);

  return {
    props: {
      files: files?.[0]?.files ?? [],
      themeColors,
      preview,
    },
  };
}

export default LetolthetoDokumentumok;
