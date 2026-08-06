import { Control, useWatch, Controller } from "react-hook-form";
import { FacultySanity } from "types";
import Select from "../FormComponents/Select";

export const SubjectField = ({
  text,
  bg,
  control,
  setAdditional,
  dependencyName,
  fieldName,
  faculties,
  clearError,
  disabled,
}: {
  advisor?: boolean;
  index?: number;
  setAdditional?: (value: string | undefined) => void;
  text: string;
  bg: string;
  dependencyName: string;
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  faculties: FacultySanity[];
  clearError?: () => void;
  disabled: boolean;
}) => {
  const selectedFaculty = useWatch({
    control,
    name: dependencyName,
  });
  const facultyData = faculties.find((f) => f._id === selectedFaculty);
  const subjects = facultyData
    ? facultyData.subjects
      ? facultyData.subjects
          .map((sb) => ({ name: sb.name, value: sb._id }))
          .concat([{ name: "Egyéb", value: "additional" }])
      : [{ name: "Egyéb", value: "additional" }]
    : selectedFaculty === "additional"
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
          options={subjects}
          value={
            subjects ? subjects.find((s) => s.value === value) || null : null
          }
          placeholder="Szak"
          setAdditional={setAdditional}
          text={text}
          bg={bg}
          error={!!error}
          disabled={!subjects || disabled}
        />
      )}
    />
  );
};
