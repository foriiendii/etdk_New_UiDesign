import { Control, useWatch, Controller } from "react-hook-form";
import { UniversitiesSanity } from "types";
import Select from "../FormComponents/Select";

export const FacultyField = ({
  text,
  bg,
  control,
  setAdditional,
  dependencyName,
  fieldName,
  universities,
  clearError,
  disabled,
}: {
  setAdditional?: (value: string | undefined) => void;
  fieldName: string;
  dependencyName: string;
  text: string;
  bg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  universities: UniversitiesSanity[];
  clearError?: () => void;
  disabled: boolean;
}) => {
  const selectedUniversity = useWatch({
    control,
    name: dependencyName,
  });
  const uniData = universities.find((uni) => uni._id === selectedUniversity);
  const faculties = uniData
    ? uniData.faculties
      ? uniData.faculties
          .map((fac) => ({ name: fac.name, value: fac._id }))
          .concat([{ name: "Egyéb", value: "additional" }])
      : [{ name: "Egyéb", value: "additional" }]
    : selectedUniversity === "additional"
    ? [{ name: "Egyéb", value: "additional" }]
    : undefined;

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
          options={faculties}
          value={
            faculties ? faculties.find((f) => f.value === value) || null : null
          }
          placeholder="Kar"
          text={text}
          bg={bg}
          setAdditional={setAdditional}
          error={!!error}
          disabled={!faculties || disabled}
        />
      )}
    />
  );
};
