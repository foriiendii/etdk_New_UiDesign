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
            <span className="pl-3">{placeholder}</span>
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
                "block h-11 w-full rounded-xl border-none pl-3 text-lg font-semibold placeholder:opacity-80 focus:border-primaryDark focus:ring-primaryDark",
                error ? "ring ring-red-700" : "",
                `${text} ${bg} placeholder:${text}`
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
