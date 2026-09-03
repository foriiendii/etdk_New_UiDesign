import classNames from "classnames";
import { Control, useWatch, Controller } from "react-hook-form";

export const OtherField = ({
  fieldName,
  dependencyName,
  placeholder,
  text,
  bg,
  control,
  clearError,
  disabled,
}: {
  dependencyName: string;
  fieldName: string;
  placeholder: string;
  index?: number;
  text: string;
  bg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  clearError?: () => void;
  disabled: boolean;
}) => {
  const dependencyValue = useWatch({
    control,
    name: dependencyName,
  });
  if (dependencyValue === "additional") {
    return (
      <Controller
        name={fieldName}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <div className="flex flex-col">
            <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">{placeholder}</span>
            <input
              onChange={(e) => {
                onChange(e.target.value);
                if (clearError) {
                  clearError();
                }
              }}
              value={value || ""}
              autoComplete="off"
              type="text"
              className={classNames(
                "block h-12 w-full rounded-xl border border-[#2c1728]/15 bg-white px-4 font-open text-base font-medium text-[#2c1728] outline-none transition-colors placeholder:font-normal placeholder:text-[#a58d90] focus:border-[#d4af6a] focus:ring-2 focus:ring-[#d4af6a]/20",
                error ? "ring ring-red-700" : ""
              )}
              placeholder={placeholder}
              disabled={disabled}
            />
          </div>
        )}
      />
    );
  }
  return null;
};
