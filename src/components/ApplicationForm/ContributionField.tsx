import classNames from "classnames";
import { useWatch, Controller, Control } from "react-hook-form";
import { SectionsSanity } from "types";

export const ContributionField = ({
  index,
  sections,
  control,
  disabled,
}: {
  index: number;
  sections: SectionsSanity[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  disabled: boolean;
}) => {
  const selectedSection = useWatch({
    control: control,
    name: `projects.${index}.section`,
  });
  const findSection = sections.find((s) => s._id === selectedSection);
  if (findSection && findSection.contributionNeeded === true) {
    return (
      <Controller
        name={`projects.${index}.contribution`}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <div className="flex flex-col">
              <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Hozzájárulási nyilatkozat</span>
              <label>
                <div
                  className={classNames(
                    "block h-12 w-full rounded-xl border border-[#2c1728]/15 bg-white px-4 font-open text-base font-medium text-[#2c1728] outline-none transition-colors placeholder:font-normal placeholder:text-[#a58d90] focus:border-[#d4af6a] focus:ring-2 focus:ring-[#d4af6a]/20",
                    "flex cursor-pointer items-center gap-2"
                  )}
                >
                  <div className="overflow-hidden truncate opacity-80">
                    {value && typeof value === "object"
                      ? value.name
                      : typeof value === "string"
                      ? value
                      : "Hozzájárulási nyilatkozat"}
                  </div>
                </div>
                <input
                  type="file"
                  autoComplete="off"
                  className="hidden"
                  onChange={(e) =>
                    onChange(e.target.files ? e.target.files[0] : null)
                  }
                  disabled={disabled}
                />
              </label>
            </div>
          );
        }}
      />
    );
  }
  return null;
};
