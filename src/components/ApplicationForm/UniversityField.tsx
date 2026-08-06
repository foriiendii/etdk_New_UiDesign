import { Control, Controller } from "react-hook-form";
import { UniversitiesSanity } from "types";
import Select from "../FormComponents/Select";

export const UniversityField = ({
  text,
  bg,
  control,
  setAdditional,
  fieldName,
  universities,
  clearError,
  disabled,
}: {
  advisor?: boolean;
  setAdditional?: (value: string | undefined) => void;
  text: string;
  bg: string;
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  index?: number;
  universities: UniversitiesSanity[];
  clearError?: () => void;
  disabled: boolean;
}) => {
  const universitiesOption = universities
    .map((uni) => ({
      name: uni.name,
      value: uni._id,
    }))
    .concat([{ name: "Egyéb", value: "additional" }]);
  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Select
          onChange={(value: string | number) => {
            onChange(value as string);
            if (clearError) {
              clearError();
            }
          }}
          options={universitiesOption}
          value={
            universitiesOption
              ? universitiesOption.find((uni) => uni.value === value) || null
              : null
          }
          placeholder="Egyetem"
          text={text}
          bg={bg}
          setAdditional={setAdditional}
          error={!!error}
          disabled={disabled}
        />
      )}
    />
  );
};
