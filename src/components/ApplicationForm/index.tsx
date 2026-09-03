import { Dialog, Disclosure, Transition } from "@headlessui/react";
import {
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { fetcher } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import Select from "src/components/FormComponents/Select";
import type {
  FacultySanity,
  SanityRichText,
  SectionsSanity,
  UniversitiesSanity,
} from "types";
import {
  classOptions,
  degreeOptions,
  inputClasses,
  Inputs,
  PersonInputs,
  ProjectInputs,
  semesterOptions,
  titleOptions,
} from "./constants";
import { ContributionField } from "./ContributionField";
import { mapAdvisorData, mapCompanionsData } from "./data";
import { FacultyField } from "./FacultyField";
import { OtherField } from "./OtherField";
import { SubjectField } from "./SubjectField";
import { UniversityField } from "./UniversityField";
import LinkWrapper from "../UtilityComponents/LinkWrapper";

const ApplicationForm = ({
  universities,
  faculties,
  sections,
  defaultValues,
  gdpr,
  closed = false,
  paymentLink,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  sections: SectionsSanity[];
  defaultValues?: {
    personData: PersonInputs;
    projectsData: ProjectInputs[];
  };
  gdpr?: SanityRichText[];
  closed?: boolean;
  paymentLink?: string;
}) => {
  const router = useRouter();
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [gdprDialog, setGdprDialog] = useState(false);
  const [gdprApproved, setGdprApproved] = useState(!!defaultValues);
  const {
    control: personFormControl,
    getValues: personGetValues,
    setValue: personSetValue,
    setError: personSetError,
    clearErrors: personClearErrors,
    formState: { errors: personErrors, dirtyFields: personDirtyFields },
  } = useForm<PersonInputs>({
    defaultValues: !defaultValues
      ? {
          name: "",
          idNumber: "",
          degree: "",
          class: "",
          university: "",
          faculty: "",
          subject: "",
          universityOther: undefined,
          facultyOther: undefined,
          subjectOther: undefined,
          finishedSemester: "",
          email: "",
          mobileNumber: "",
          idPhoto: null,
          voucher: null,
        }
      : defaultValues.personData,
  });
  const {
    control: projectsControl,
    handleSubmit,
    setValue: projectSetValue,
    getValues: projectGetValues,
    formState: { errors: projectErrors, dirtyFields: projectDirtyFields },
    clearErrors: projectCleanErrors,
    setError: projectSetErrors,
  } = useForm<Inputs>({
    defaultValues: {
      projects: !defaultValues
        ? [
            {
              advisors: [
                {
                  name: "",
                  email: "",
                  title: "",
                  titleOther: undefined,
                  university: "",
                  universityOther: undefined,
                  certificate: null,
                },
              ],
              title: "",
              extract: null,
              section: "",
              contribution: null,
              annex: null,
              companions: [],
            },
          ]
        : defaultValues.projectsData,
    },
  });

  const { append, remove, fields, update } = useFieldArray({
    control: projectsControl,
    name: "projects",
  });

  const patchSubmit = React.useCallback(
    async (data: Inputs) => {
      const toastId = toast.loading("Mentés folyamatban");
      const participantData = personGetValues();
      const idPhotoData =
        personDirtyFields.idPhoto &&
        participantData.idPhoto &&
        typeof participantData.idPhoto === "object"
          ? await getClient().assets.upload("file", participantData.idPhoto, {
              filename: participantData.idPhoto.name,
            })
          : null;
      const voucherData =
        personDirtyFields.voucher &&
        participantData.voucher &&
        typeof participantData.voucher === "object"
          ? await getClient().assets.upload("file", participantData.voucher, {
              filename: participantData.voucher.name,
            })
          : null;
      Promise.all(
        data.projects.map(async (project, index) => {
          const extractData =
            projectDirtyFields.projects?.[index]?.extract &&
            project.extract &&
            typeof project.extract === "object"
              ? await getClient().assets.upload("file", project.extract, {
                  filename: project.extract.name,
                })
              : null;
          const annexData =
            projectDirtyFields.projects?.[index]?.annex &&
            project.annex &&
            typeof project.annex === "object"
              ? await getClient().assets.upload("file", project.annex, {
                  filename: project.annex.name,
                })
              : null;
          const essayData =
            projectDirtyFields.projects?.[index]?.essay &&
            project.essay &&
            typeof project.essay === "object"
              ? await getClient().assets.upload("file", project.essay, {
                  filename: project.essay.name,
                })
              : null;
          const contributionData =
            projectDirtyFields.projects?.[index]?.contribution &&
            project.contribution &&
            typeof project.contribution === "object"
              ? await getClient().assets.upload("file", project.contribution, {
                  filename: project.contribution.name,
                })
              : null;
          const advisors = await Promise.all(
            project.advisors.map(
              async (advisor, ai) =>
                await mapAdvisorData(
                  advisor,
                  !!projectDirtyFields.projects?.[index]?.advisors?.[ai]
                    ?.certificate
                )
            )
          ).then((advisors) => advisors);
          const companions = await Promise.all(
            (project.companions || []).map(
              async (companion, ci) =>
                await mapCompanionsData(
                  companion,
                  !!projectDirtyFields.projects?.[index]?.companions?.[ci]
                    ?.idPhoto,
                  !!projectDirtyFields.projects?.[index]?.companions?.[ci]
                    ?.voucher
                )
            )
          ).then((companions) => companions);
          const mutations = [
            {
              patch: {
                id: project._id,
                set: {
                  name: participantData.name,
                  idNumber: participantData.idNumber,
                  ...(participantData.universityOther
                    ? {
                        universityOther: participantData.universityOther,
                      }
                    : {
                        university: {
                          _type: "reference",
                          _ref: participantData.university,
                        },
                      }),
                  ...(participantData.facultyOther
                    ? { facultyOther: participantData.facultyOther }
                    : {
                        faculty: {
                          _type: "reference",
                          _ref: participantData.faculty,
                        },
                      }),
                  ...(participantData.subjectOther
                    ? { subjectOther: participantData.subjectOther }
                    : {
                        subject: {
                          _type: "reference",
                          _ref: participantData.subject,
                        },
                      }),
                  degree: participantData.degree,
                  class: participantData.class,
                  finishedSemester: participantData.finishedSemester,
                  email: participantData.email,
                  mobileNumber: participantData.mobileNumber,
                  ...(idPhotoData && {
                    idPhoto: {
                      _type: "file",
                      asset: {
                        _ref: idPhotoData._id,
                        _type: "reference",
                      },
                    },
                  }),
                  ...(contributionData && {
                    contribution: {
                      _type: "file",
                      asset: {
                        _ref: contributionData._id,
                        _type: "reference",
                      },
                    },
                  }),
                  ...(essayData && {
                    essay: {
                      _type: "file",
                      asset: {
                        _ref: essayData._id,
                        _type: "reference",
                      },
                    },
                  }),
                  ...(annexData && {
                    annex: {
                      _type: "file",
                      asset: {
                        _ref: annexData._id,
                        _type: "reference",
                      },
                    },
                  }),
                  ...(voucherData && {
                    voucher: {
                      _type: "file",
                      asset: {
                        _ref: voucherData._id,
                        _type: "reference",
                      },
                    },
                  }),
                  advisors: advisors,
                  companions: companions,
                  title: project.title,
                  ...(extractData && {
                    extract: {
                      _type: "file",
                      asset: {
                        _ref: extractData._id,
                        _type: "reference",
                      },
                    },
                  }),
                  section: {
                    _type: "reference",
                    _ref: project.section,
                  },
                },
              },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ] as any;
          return await fetcher(
            `/participants/upload/mutations`,
            JSON.stringify(mutations)
          ).then((r) => {
            if (r.hasOwnProperty("error")) {
              throw Error(`${index + 1} projekt javitása közben hiba történt`);
            }
          });
        })
      )
        .then(() => {
          setTimeout(() => {
            toast.success("Változtatások sikeresen elmentve", {
              id: toastId,
            });
            router.reload();
            setSaving(false);
          }, 3000);
        })
        .catch((e) => {
          toast.error(e.message, {
            id: toastId,
          });
        });
    },
    [
      personDirtyFields.idPhoto,
      personDirtyFields.voucher,
      personGetValues,
      projectDirtyFields.projects,
      router,
    ]
  );

  const onSubmit = React.useMemo(() => {
    return handleSubmit(async (data) => {
      setSaving(true);
      if (defaultValues) {
        await patchSubmit(data);
      } else {
        const toastId = toast.loading("Mentés folyamatban");
        const participantData = personGetValues();
        const checkEmail = await fetcher(
          `/participants/check`,
          JSON.stringify({
            email: participantData.email,
          })
        );
        if (Array.isArray(checkEmail) && !checkEmail.length) {
          const password = Math.random().toString(36).slice(-8);
          const idPhotoData =
            participantData.idPhoto &&
            typeof participantData.idPhoto === "object"
              ? await getClient().assets.upload(
                  "file",
                  participantData.idPhoto,
                  {
                    filename: participantData.idPhoto.name,
                  }
                )
              : null;
          const voucherData =
            personDirtyFields.voucher &&
            participantData.voucher &&
            typeof participantData.voucher === "object"
              ? await getClient().assets.upload(
                  "file",
                  participantData.voucher,
                  {
                    filename: participantData.voucher.name,
                  }
                )
              : null;
          Promise.all(
            data.projects.map(async (project, index) => {
              if (project.extract && typeof project.extract === "object") {
                const extractData =
                  project.extract && typeof project.extract === "object"
                    ? await getClient().assets.upload("file", project.extract, {
                        filename: project.extract.name,
                      })
                    : null;
                const advisors = await Promise.all(
                  project.advisors.map(
                    async (advisor) => await mapAdvisorData(advisor, true)
                  )
                ).then((advisors) => advisors);
                const companions = await Promise.all(
                  (project.companions || []).map(
                    async (companion) =>
                      await mapCompanionsData(companion, true)
                  )
                ).then((companions) => companions);
                const mutations = [
                  {
                    create: {
                      _type: "participants",
                      name: participantData.name,
                      idNumber: participantData.idNumber,
                      ...(participantData.universityOther
                        ? {
                            universityOther: participantData.universityOther,
                          }
                        : {
                            university: {
                              _type: "reference",
                              _ref: participantData.university,
                            },
                          }),
                      ...(participantData.facultyOther
                        ? { facultyOther: participantData.facultyOther }
                        : {
                            faculty: {
                              _type: "reference",
                              _ref: participantData.faculty,
                            },
                          }),
                      ...(participantData.subjectOther
                        ? { subjectOther: participantData.subjectOther }
                        : {
                            subject: {
                              _type: "reference",
                              _ref: participantData.subject,
                            },
                          }),
                      degree: participantData.degree,
                      class: participantData.class,
                      finishedSemester: participantData.finishedSemester,
                      email: participantData.email,
                      mobileNumber: participantData.mobileNumber,
                      ...(idPhotoData && {
                        idPhoto: {
                          _type: "file",
                          asset: {
                            _ref: idPhotoData._id,
                            _type: "reference",
                          },
                        },
                      }),
                      ...(voucherData && {
                        voucher: {
                          _type: "file",
                          asset: {
                            _ref: voucherData._id,
                            _type: "reference",
                          },
                        },
                      }),
                      advisors: advisors,
                      companions: companions,
                      title: project.title,
                      ...(extractData && {
                        extract: {
                          _type: "file",
                          asset: {
                            _ref: extractData._id,
                            _type: "reference",
                          },
                        },
                      }),
                      section: {
                        _type: "reference",
                        _ref: project.section,
                      },
                      accepted: false,
                      password: password,
                      gdpr: true,
                    },
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ] as any;
                return await fetcher(
                  `/participants/upload/mutations`,
                  JSON.stringify(mutations)
                ).then((r) => {
                  if (r.hasOwnProperty("error")) {
                    throw Error(
                      `${index + 1} projekt feltöltése közben hiba történt`
                    );
                  }
                });
              }
            })
          )
            .then(() => {
              setSaving(false);
              setConfirmationMessage(password);
              toast.success("Jelentkezés sikeres", {
                id: toastId,
              });
            })
            .catch((e) => {
              toast.error(e.message, {
                id: toastId,
              });
              setSaving(false);
            });
        } else {
          toast.error("Ezen az emailen már regisztrálva van", {
            id: toastId,
          });
          setSaving(false);
        }
      }
    });
  }, [
    handleSubmit,
    defaultValues,
    patchSubmit,
    personGetValues,
    personDirtyFields.voucher,
  ]);

  const submitData = () => {
    const participantData = personGetValues();
    let error = false;
    Object.entries(participantData).forEach((data) => {
      if (!data[1]) {
        if (
          (data[0] === "universityOther" &&
            participantData.university !== "additional") ||
          (data[0] === "facultyOther" &&
            participantData.faculty !== "additional") ||
          (data[0] === "subjectOther" &&
            participantData.subject !== "additional")
        ) {
          return;
        }
        error = true;
        personSetError(data[0] as keyof PersonInputs, { type: "required" });
      } else {
        if (data[0] === "email") {
          const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
          if (!regex.test(data[1] as string)) {
            error = true;
            personSetError(data[0] as keyof PersonInputs, { type: "pattern" });
          }
        }
        if (data[0] === "mobileNumber") {
          const regex = /^(\+\d{1,2}\s?)?\(?\d{4}\)?[\s.-]?\d{3}[\s.-]?\d{3}$/;
          if (!regex.test(data[1] as string)) {
            error = true;
            personSetError(data[0] as keyof PersonInputs, { type: "pattern" });
          }
        }
      }
    });
    if (!error) {
      personClearErrors();
      setConfirmDialog(true);
    }
  };

  const AddAdvisorButton = ({ index }: { index: number }) => {
    const advisors = useWatch({
      control: projectsControl,
      name: `projects.${index}.advisors`,
    });
    if (advisors.length < 4) {
      return (
        <div className="flex flex-col items-center md:flex-row ">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#2c1728]/15 bg-white px-4 py-2.5 font-open text-sm font-semibold text-[#2c1728] transition-colors hover:border-[#d4af6a] hover:bg-[#faf7f4]"
            onClick={() => {
              const projectValues = projectGetValues(`projects.${index}`);
              update(index, {
                ...projectValues,
                advisors: [
                  ...(projectValues.advisors || []),
                  {
                    name: "",
                    email: "",
                    title: "",
                    university: "",
                    universityOther: undefined,
                    certificate: null,
                  },
                ],
              });
            }}
          >
            <PlusIcon className="h-4 w-4 text-[#d4af6a]" />
            <p>Témavezető hozzáadása</p>
          </button>
        </div>
      );
    }
    return null;
  };

  const AddCompanionButton = ({ index }: { index: number }) => {
    const companions = useWatch({
      control: projectsControl,
      name: `projects.${index}.companions`,
    });
    if (!companions || companions.length < 4) {
      return (
        <div className="flex flex-col items-center md:flex-row ">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#2c1728]/15 bg-white px-4 py-2.5 font-open text-sm font-semibold text-[#2c1728] transition-colors hover:border-[#d4af6a] hover:bg-[#faf7f4]"
            onClick={() => {
              const projectValues = projectGetValues(`projects.${index}`);
              update(index, {
                ...projectValues,
                companions: [
                  ...(projectValues.companions || []),
                  {
                    name: "",
                    idNumber: "",
                    degree: "",
                    class: "",
                    university: "",
                    faculty: "",
                    subject: "",
                    universityOther: undefined,
                    facultyOther: undefined,
                    subjectOther: undefined,
                    finishedSemester: "",
                    email: "",
                    mobileNumber: "",
                    idPhoto: null,
                  },
                ],
              });
            }}
          >
            <PlusIcon className="h-4 w-4 text-[#d4af6a]" />
            <p>Társszerző hozzáadása</p>
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-[100vh] min-w-full flex-col items-center bg-[#f5f1ed] pb-40 pt-[66px]">
      <div className="w-full space-y-4 md:w-[720px]">
        <div className="space-y-5 rounded-2xl border border-[#2c1728]/10 bg-white p-5 shadow-[0_16px_45px_rgba(44,23,40,0.06)] md:p-7">
          <p className="font-bebas text-3xl uppercase tracking-wide text-[#2c1728] md:text-4xl">Személyes adatok</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
            <Controller
              name="name"
              control={personFormControl}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <div className="flex flex-col">
                  <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Név</span>
                  <input
                    value={value}
                    onChange={(e) => {
                      personClearErrors("name");
                      onChange(e.target.value);
                    }}
                    autoComplete="off"
                    type="text"
                    className={classNames(
                      inputClasses,
                      error ? "ring ring-red-700" : "",
                      ""
                    )}
                    placeholder="Név"
                    disabled={closed}
                  />
                </div>
              )}
            />
            <Controller
              name="idNumber"
              control={personFormControl}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <div className="flex flex-col">
                  <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                    Hallgatói azonosító (nr. matricol)
                  </span>
                  <input
                    value={value}
                    onChange={(e) => {
                      personClearErrors("idNumber");
                      onChange(e.target.value);
                    }}
                    autoComplete="off"
                    type="text"
                    className={classNames(
                      inputClasses,
                      error ? "ring ring-red-700" : "",
                      ""
                    )}
                    placeholder="Hallgatói azonosító (nr. matricol)"
                    disabled={closed}
                  />
                </div>
              )}
            />
            <UniversityField
              control={personFormControl}
              fieldName="university"
              text="text-primaryDark"
              bg="bg-application1"
              setAdditional={(value: string | undefined) => {
                personSetValue("faculty", "");
                personSetValue("universityOther", value);
              }}
              universities={universities}
              clearError={() => personClearErrors("university")}
              disabled={closed}
            />
            <OtherField
              control={personFormControl}
              text="text-primaryDark"
              bg="bg-application1"
              dependencyName="university"
              fieldName="universityOther"
              placeholder="Egyéb egyetem"
              clearError={() => personClearErrors("universityOther")}
              disabled={closed}
            />
            <FacultyField
              control={personFormControl}
              fieldName="faculty"
              dependencyName="university"
              text="text-primaryDark"
              bg="bg-application1"
              setAdditional={(value: string | undefined) => {
                personSetValue("subject", "");
                personSetValue("facultyOther", value);
              }}
              universities={universities}
              clearError={() => personClearErrors("faculty")}
              disabled={closed}
            />
            <OtherField
              control={personFormControl}
              text="text-primaryDark"
              bg="bg-application1"
              dependencyName="faculty"
              fieldName="facultyOther"
              placeholder="Egyéb kar"
              clearError={() => personClearErrors("facultyOther")}
              disabled={closed}
            />
            <SubjectField
              fieldName="subject"
              dependencyName="faculty"
              control={personFormControl}
              text="text-primaryDark"
              bg="bg-application1"
              setAdditional={(value: string | undefined) =>
                personSetValue("subjectOther", value)
              }
              faculties={faculties}
              clearError={() => personClearErrors("subject")}
              disabled={closed}
            />
            <OtherField
              control={personFormControl}
              text="text-primaryDark"
              bg="bg-application1"
              dependencyName="subject"
              fieldName="subjectOther"
              placeholder="Egyéb szak"
              clearError={() => personClearErrors("subjectOther")}
              disabled={closed}
            />
            <Controller
              name="degree"
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Select
                  onChange={(value: string | number) => {
                    personClearErrors("degree");
                    onChange(value as string);
                  }}
                  options={degreeOptions}
                  value={degreeOptions.find((d) => d.value === value) || null}
                  placeholder="Képzési szint"
                  text="text-primaryDark"
                  bg="bg-application1"
                  error={!!error}
                  disabled={closed}
                />
              )}
            />
            <Controller
              name="class"
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Select
                  onChange={(value: string | number) => {
                    personClearErrors("class");
                    onChange(value as string);
                  }}
                  options={classOptions}
                  value={classOptions.find((c) => c.value === value) || null}
                  placeholder="Évfolyam"
                  text="text-primaryDark"
                  bg="bg-application1"
                  error={!!error}
                  disabled={closed}
                />
              )}
            />
            <Controller
              name="finishedSemester"
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Select
                  onChange={(value: string | number) => {
                    personClearErrors("finishedSemester");
                    onChange(value as string);
                  }}
                  options={semesterOptions}
                  value={semesterOptions.find((c) => c.value === value) || null}
                  placeholder="Elvégzett félévek száma"
                  text="text-primaryDark"
                  bg="bg-application1"
                  error={!!error}
                  disabled={closed}
                />
              )}
            />
            <Controller
              name="email"
              control={personFormControl}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <div className="flex flex-col">
                  <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">E-mail cím</span>
                  <input
                    value={value}
                    onChange={(e) => {
                      personClearErrors("email");
                      onChange(e.target.value);
                    }}
                    autoComplete="off"
                    disabled={!!defaultValues || closed}
                    type="text"
                    className={classNames(
                      inputClasses,
                      error ? "ring ring-red-700" : "",
                      ""
                    )}
                    placeholder="E-mail cím"
                  />
                </div>
              )}
            />
            <Controller
              name="mobileNumber"
              control={personFormControl}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <div className="flex flex-col">
                  <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Telefonszám</span>
                  <input
                    value={value}
                    onChange={(e) => {
                      personClearErrors("mobileNumber");
                      onChange(e.target.value);
                    }}
                    autoComplete="off"
                    type="text"
                    className={classNames(
                      inputClasses,
                      error ? "ring ring-red-700" : "",
                      ""
                    )}
                    placeholder="Telefonszám"
                    disabled={closed}
                  />
                </div>
              )}
            />
            <Controller
              name="idPhoto"
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <div className="flex flex-col">
                    <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                      Hallgatói jogviszonyt igazoló dokumentum
                    </span>
                    <label>
                      <div
                        className={classNames(
                          inputClasses,
                          error ? "ring ring-red-700" : "",
                          "flex cursor-pointer items-center gap-2"
                        )}
                      >
                        <div className="overflow-hidden truncate opacity-80">
                          {value && typeof value === "object"
                            ? value.name
                            : typeof value === "string"
                            ? value
                            : "Kép az ellenőrző első két oldaláról"}
                        </div>
                      </div>
                      <input
                        type="file"
                        autoComplete="off"
                        className="hidden"
                        onChange={(e) => {
                          const fileSize =
                            e.target.files && e.target.files[0]
                              ? Math.round((e.target.files[0].size || 0) / 1024)
                              : null;

                          if (fileSize && fileSize >= 4096) {
                            personSetError("idPhoto", {
                              type: "custom",
                              message: "Kép mérete max. 4mb",
                            });
                          } else {
                            personClearErrors("idPhoto");
                            onChange(e.target.files ? e.target.files[0] : null);
                          }
                        }}
                        disabled={closed}
                      />
                    </label>
                    {error && error.type === "custom" && (
                      <p className="pl-1 pt-1 font-open text-xs font-medium text-red-600">
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <Controller
              name="voucher"
              rules={{ required: true }}
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <div className="flex flex-col">
                    <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Kifizetési bizonylat</span>

                    <label>
                      <div
                        className={classNames(
                          inputClasses,
                          error ? "ring ring-red-700" : "",
                          "flex cursor-pointer items-center gap-2"
                        )}
                      >
                        <div className="overflow-hidden truncate opacity-80">
                          {value && typeof value === "object"
                            ? value.name
                            : typeof value === "string"
                            ? value
                            : "Kifizetési bizonylat"}
                        </div>
                      </div>
                      <input
                        type="file"
                        autoComplete="off"
                        className="hidden"
                        onChange={(e) => {
                          personClearErrors("voucher");
                          onChange(e.target.files ? e.target.files[0] : null);
                        }}
                        disabled={closed}
                      />
                    </label>
                    {paymentLink && (
                      <LinkWrapper href={paymentLink}>
                        <p className="pl-1 font-open text-xs font-semibold text-[#a77f35] underline transition-colors hover:text-[#2c1728]">
                          Befizetés
                        </p>
                      </LinkWrapper>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
        {fields.map((project, index) => (
          <Disclosure defaultOpen={index === 0} key={project.id}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center gap-3 rounded-xl border border-[#2c1728]/10 bg-white px-5 py-3.5 shadow-[0_8px_20px_rgba(44,23,40,0.05)] transition-colors hover:border-[#d4af6a]/60">
                  <p className="flex-1 text-start font-open text-base font-semibold text-[#2c1728]">
                    {index + 1}. Dolgozat adatai
                  </p>
                  {fields.length > 1 && !defaultValues && (
                    <TrashIcon
                      className="h-5 w-5 shrink-0 cursor-pointer text-[#a58d90] transition-colors hover:text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                    />
                  )}

                  {!open ? (
                    <ChevronDownIcon
                      className="h-5 w-5 shrink-0 text-[#d4af6a]"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronUpIcon
                      className="h-5 w-5 shrink-0 text-[#d4af6a]"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
                <Transition
                  enter="transition duration-150 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-150 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                  unmount={false}
                >
                  <Disclosure.Panel
                    className="p-0"
                    unmount={false}
                  >
                    <div className="space-y-5 rounded-2xl border border-[#2c1728]/10 bg-white p-5 shadow-[0_16px_45px_rgba(44,23,40,0.06)] md:p-7">
                      <p className="font-bebas text-3xl uppercase tracking-wide text-[#2c1728] md:text-4xl">
                        {index + 1}. Dolgozat
                      </p>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                        <Controller
                          name={`projects.${index}.title`}
                          control={projectsControl}
                          rules={{ required: true }}
                          render={({ field, fieldState: { error } }) => (
                            <div className="flex flex-col">
                              <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Cím</span>
                              <input
                                {...field}
                                type="text"
                                autoComplete="off"
                                className={classNames(
                                  inputClasses,
                                  error ? "ring ring-red-700" : "",
                                  ""
                                )}
                                placeholder="Cím"
                                disabled={closed}
                              />
                            </div>
                          )}
                        />
                        <Controller
                          name={`projects.${index}.extract`}
                          control={projectsControl}
                          rules={{
                            required: true,
                            validate: (value) => {
                              if (value && typeof value === "object") {
                                return value?.type === "application/pdf";
                              }
                              return true;
                            },
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => {
                            return (
                              <div className="flex flex-col">
                                <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Kivonat</span>
                                <label>
                                  <div
                                    className={classNames(
                                      inputClasses,
                                      error ? "ring ring-red-700" : "",
                                      "flex cursor-pointer items-center gap-2"
                                    )}
                                  >
                                    <div className="overflow-hidden truncate opacity-80">
                                      {value && typeof value === "object"
                                        ? value.name
                                        : typeof value === "string"
                                        ? value
                                        : "Kivonat"}
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    autoComplete="off"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={(e) =>
                                      onChange(
                                        e.target.files
                                          ? e.target.files[0]
                                          : null
                                      )
                                    }
                                    disabled={closed}
                                  />
                                </label>
                              </div>
                            );
                          }}
                        />
                        <Controller
                          name={`projects.${index}.section`}
                          control={projectsControl}
                          rules={{ required: true }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => {
                            const sectionsOptions = sections.map((s) => ({
                              name: s.name,
                              value: s._id,
                            }));
                            return (
                              <Select
                                disabled={!!defaultValues || closed}
                                onChange={(value: string | number) => {
                                  onChange(value as string);
                                }}
                                options={sectionsOptions}
                                value={
                                  sectionsOptions.find(
                                    (s) => s.value === value
                                  ) || null
                                }
                                placeholder="Szekció"
                                text="text-primaryDark"
                                bg="bg-application3"
                                error={!!error}
                              />
                            );
                          }}
                        />
                        {defaultValues && (
                          <Controller
                            name={`projects.${index}.essay`}
                            control={projectsControl}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <div className="flex flex-col">
                                  <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Dolgozat</span>
                                  <label>
                                    <div
                                      className={classNames(
                                        inputClasses,
                                        "flex cursor-pointer items-center gap-2"
                                      )}
                                    >
                                      <div className="overflow-hidden truncate opacity-80">
                                        {value && typeof value === "object"
                                          ? value.name
                                          : typeof value === "string"
                                          ? value
                                          : "Dolgozat"}
                                      </div>
                                    </div>
                                    <input
                                      type="file"
                                      autoComplete="off"
                                      className="hidden"
                                      onChange={(e) =>
                                        onChange(
                                          e.target.files
                                            ? e.target.files[0]
                                            : null
                                        )
                                      }
                                      disabled={closed}
                                    />
                                  </label>
                                </div>
                              );
                            }}
                          />
                        )}
                        {defaultValues && (
                          <Controller
                            name={`projects.${index}.annex`}
                            control={projectsControl}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <div className="flex flex-col">
                                  <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Melléklet</span>
                                  <label>
                                    <div
                                      className={classNames(
                                        inputClasses,
                                        "flex cursor-pointer items-center gap-2"
                                      )}
                                    >
                                      <div className="overflow-hidden truncate opacity-80">
                                        {value && typeof value === "object"
                                          ? value.name
                                          : typeof value === "string"
                                          ? value
                                          : "Melléklet"}
                                      </div>
                                    </div>
                                    <input
                                      type="file"
                                      autoComplete="off"
                                      className="hidden"
                                      onChange={(e) =>
                                        onChange(
                                          e.target.files
                                            ? e.target.files[0]
                                            : null
                                        )
                                      }
                                      disabled={closed}
                                    />
                                  </label>
                                </div>
                              );
                            }}
                          />
                        )}
                        {defaultValues && (
                          <ContributionField
                            index={index}
                            control={projectsControl}
                            sections={sections}
                            disabled={closed}
                          />
                        )}
                      </div>
                    </div>
                    {project.advisors.map((_advisor, ai) => (
                      <React.Fragment key={"companion" + ai}>
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="my-4 flex w-full items-center gap-3 rounded-xl border border-[#2c1728]/10 bg-[#faf7f4] px-5 py-3 transition-colors hover:border-[#d4af6a]/60">
                                <p className="flex-1 text-start font-open text-base font-semibold text-[#2c1728]">
                                  {ai + 1}. Témavezető adatai:
                                </p>
                                {ai !== 0 && (
                                  <TrashIcon
                                    className="h-5 w-5 shrink-0 cursor-pointer text-[#a58d90] transition-colors hover:text-red-500"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        window.confirm(
                                          "Biztos törölni szeretnéd?"
                                        )
                                      ) {
                                        const projectValues = projectGetValues(
                                          `projects.${index}`
                                        );
                                        const projectAdvisors =
                                          projectValues.advisors || [];
                                        projectAdvisors.splice(ai, 1);
                                        update(index, {
                                          ...projectValues,
                                          advisors: projectAdvisors,
                                        });
                                        projectCleanErrors(
                                          `projects.${index}.advisors.${ai}`
                                        );
                                      }
                                    }}
                                  />
                                )}

                                {!open ? (
                                  <ChevronDownIcon
                                    className="h-5 w-5 shrink-0 text-[#d4af6a]"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ChevronUpIcon
                                    className="h-5 w-5 shrink-0 text-[#d4af6a]"
                                    aria-hidden="true"
                                  />
                                )}
                              </Disclosure.Button>
                              <Transition
                                enter="transition duration-150 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-150 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                                unmount={false}
                              >
                                <Disclosure.Panel unmount={false}>
                                  <div className="space-y-5 rounded-2xl border border-[#2c1728]/10 bg-white p-5 shadow-[0_16px_45px_rgba(44,23,40,0.06)] md:p-7">
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.name`}
                                        control={projectsControl}
                                        rules={{ required: true }}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <div className="flex flex-col">
                                            <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Név</span>
                                            <input
                                              {...field}
                                              autoComplete="off"
                                              type="text"
                                              className={classNames(
                                                inputClasses,
                                                error
                                                  ? "ring ring-red-700"
                                                  : "",
                                                ""
                                              )}
                                              placeholder="Név"
                                              disabled={closed}
                                            />
                                          </div>
                                        )}
                                      />
                                      <UniversityField
                                        fieldName={`projects.${index}.advisors.${ai}.university`}
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        setAdditional={(
                                          value: string | undefined
                                        ) => {
                                          projectSetValue(
                                            `projects.${index}.advisors.${ai}.universityOther`,
                                            value
                                          );
                                        }}
                                        universities={universities}
                                        disabled={closed}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        dependencyName={`projects.${index}.advisors.${ai}.university`}
                                        fieldName={`projects.${index}.advisors.${ai}.universityOther`}
                                        placeholder="Egyéb egyetem"
                                        disabled={closed}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.title`}
                                        control={projectsControl}
                                        rules={{ required: true }}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => (
                                          <Select
                                            onChange={(
                                              value: string | number
                                            ) => {
                                              onChange(value as string);
                                            }}
                                            options={titleOptions}
                                            value={
                                              titleOptions.find(
                                                (t) => t.value === value
                                              ) || null
                                            }
                                            placeholder="Titulus"
                                            text="text-white"
                                            bg="bg-application2"
                                            error={!!error}
                                            disabled={closed}
                                          />
                                        )}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        dependencyName={`projects.${index}.advisors.${ai}.title`}
                                        fieldName={`projects.${index}.advisors.${ai}.titleOther`}
                                        placeholder="Egyéb titulus"
                                        disabled={closed}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.email`}
                                        control={projectsControl}
                                        rules={{
                                          required: true,
                                          pattern: {
                                            value:
                                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Helytelen email",
                                          },
                                        }}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <div className="flex flex-col">
                                            <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                                              E-mail cím
                                            </span>
                                            <input
                                              {...field}
                                              autoComplete="off"
                                              type="text"
                                              className={classNames(
                                                inputClasses,
                                                error
                                                  ? "ring ring-red-700"
                                                  : "",
                                                ""
                                              )}
                                              placeholder="E-mail cím"
                                              disabled={closed}
                                            />
                                          </div>
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.certificate`}
                                        control={projectsControl}
                                        rules={{
                                          required: true,
                                          validate: (value) => {
                                            if (
                                              value &&
                                              typeof value === "object"
                                            ) {
                                              return (
                                                value?.type ===
                                                "application/pdf"
                                              );
                                            }
                                            return true;
                                          },
                                        }}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => {
                                          return (
                                            <div className="flex flex-col">
                                              <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                                                Témavezetői igazolás
                                              </span>
                                              <label>
                                                <div
                                                  className={classNames(
                                                    inputClasses,
                                                    error
                                                      ? "ring ring-red-700"
                                                      : "",
                                                    "flex cursor-pointer items-center gap-2"
                                                  )}
                                                >
                                                  <div className="overflow-hidden truncate opacity-80">
                                                    {value &&
                                                    typeof value === "object"
                                                      ? value.name
                                                      : typeof value ===
                                                        "string"
                                                      ? value
                                                      : "Témavezetői igazolás"}
                                                  </div>
                                                </div>
                                                <input
                                                  type="file"
                                                  autoComplete="off"
                                                  className="hidden"
                                                  accept="application/pdf"
                                                  onChange={(e) =>
                                                    onChange(
                                                      e.target.files
                                                        ? e.target.files[0]
                                                        : null
                                                    )
                                                  }
                                                  disabled={closed}
                                                />
                                              </label>
                                            </div>
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              </Transition>
                            </>
                          )}
                        </Disclosure>
                      </React.Fragment>
                    ))}
                    {(project.companions || []).map((_companion, ci) => (
                      <React.Fragment key={"companion" + ci}>
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="my-4 flex w-full items-center gap-3 rounded-xl border border-[#2c1728]/10 bg-[#faf7f4] px-5 py-3 transition-colors hover:border-[#d4af6a]/60">
                                <p className="flex-1 text-start font-open text-base font-semibold text-[#2c1728]">
                                  {ci + 1}. Társszerző adatok:
                                </p>
                                <TrashIcon
                                  className="h-5 w-5 shrink-0 cursor-pointer text-[#a58d90] transition-colors hover:text-red-500"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                      window.confirm(
                                        "Biztos törölni szeretnéd?"
                                      )
                                    ) {
                                      const projectValues = projectGetValues(
                                        `projects.${index}`
                                      );
                                      const projectCompanions =
                                        projectValues.companions || [];
                                      projectCompanions.splice(ci, 1);
                                      update(index, {
                                        ...projectValues,
                                        companions: projectCompanions,
                                      });
                                      projectCleanErrors(
                                        `projects.${index}.companions.${ci}`
                                      );
                                    }
                                  }}
                                />

                                {!open ? (
                                  <ChevronDownIcon
                                    className="h-5 w-5 shrink-0 text-[#d4af6a]"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ChevronUpIcon
                                    className="h-5 w-5 shrink-0 text-[#d4af6a]"
                                    aria-hidden="true"
                                  />
                                )}
                              </Disclosure.Button>
                              <Transition
                                enter="transition duration-150 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-150 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                                unmount={false}
                              >
                                <Disclosure.Panel unmount={false}>
                                  <div className="space-y-5 rounded-2xl border border-[#2c1728]/10 bg-white p-5 shadow-[0_16px_45px_rgba(44,23,40,0.06)] md:p-7">
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.name`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <div className="flex flex-col">
                                            <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">Név</span>
                                            <input
                                              {...field}
                                              autoComplete="off"
                                              type="text"
                                              className={classNames(
                                                inputClasses,
                                                error
                                                  ? "ring ring-red-700"
                                                  : "",
                                                ""
                                              )}
                                              placeholder="Név"
                                              disabled={closed}
                                            />
                                          </div>
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.idNumber`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <div className="flex flex-col">
                                            <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                                              Hallgatói azonosító (nr. matricol)
                                            </span>
                                            <input
                                              {...field}
                                              autoComplete="off"
                                              type="text"
                                              className={classNames(
                                                inputClasses,
                                                error
                                                  ? "ring ring-red-700"
                                                  : "",
                                                ""
                                              )}
                                              placeholder="Hallgatói azonosító (nr. matricol)"
                                              disabled={closed}
                                            />
                                          </div>
                                        )}
                                      />
                                      <UniversityField
                                        control={projectsControl}
                                        fieldName={`projects.${index}.companions.${ci}.university`}
                                        text="text-primaryDark"
                                        bg="bg-application1"
                                        setAdditional={(
                                          value: string | undefined
                                        ) => {
                                          projectSetValue(
                                            `projects.${index}.companions.${ci}.universityOther`,
                                            value
                                          );
                                        }}
                                        universities={universities}
                                        disabled={closed}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-primaryDark"
                                        bg="bg-application1"
                                        fieldName={`projects.${index}.companions.${ci}.universityOther`}
                                        dependencyName={`projects.${index}.companions.${ci}.university`}
                                        placeholder="Egyéb egyetem"
                                        disabled={closed}
                                      />
                                      <FacultyField
                                        control={projectsControl}
                                        fieldName={`projects.${index}.companions.${ci}.faculty`}
                                        dependencyName={`projects.${index}.companions.${ci}.university`}
                                        text="text-primaryDark"
                                        bg="bg-application1"
                                        setAdditional={(
                                          value: string | undefined
                                        ) =>
                                          projectSetValue(
                                            `projects.${index}.companions.${ci}.facultyOther`,
                                            value
                                          )
                                        }
                                        universities={universities}
                                        disabled={closed}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-primaryDark"
                                        bg="bg-application1"
                                        dependencyName={`projects.${index}.companions.${ci}.faculty`}
                                        fieldName={`projects.${index}.companions.${ci}.facultyOther`}
                                        placeholder="Egyéb kar"
                                        disabled={closed}
                                      />
                                      <SubjectField
                                        fieldName={`projects.${index}.companions.${ci}.subject`}
                                        dependencyName={`projects.${index}.companions.${ci}.faculty`}
                                        control={projectsControl}
                                        text="text-primaryDark"
                                        bg="bg-application1"
                                        setAdditional={(
                                          value: string | undefined
                                        ) =>
                                          projectSetValue(
                                            `projects.${index}.companions.${ci}.subjectOther`,
                                            value
                                          )
                                        }
                                        faculties={faculties}
                                        disabled={closed}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-primaryDark"
                                        bg="bg-application1"
                                        dependencyName={`projects.${index}.companions.${ci}.subject`}
                                        fieldName={`projects.${index}.companions.${ci}.subjectOther`}
                                        placeholder="Egyéb szak"
                                        disabled={closed}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.degree`}
                                        control={projectsControl}
                                        rules={{ required: true }}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => (
                                          <Select
                                            onChange={(
                                              value: string | number
                                            ) => {
                                              onChange(value as string);
                                            }}
                                            options={degreeOptions}
                                            value={
                                              degreeOptions.find(
                                                (d) => d.value === value
                                              ) || null
                                            }
                                            placeholder="Képzési szint"
                                            text="text-primaryDark"
                                            bg="bg-application1"
                                            error={!!error}
                                            disabled={closed}
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.class`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => (
                                          <Select
                                            onChange={(
                                              value: string | number
                                            ) => {
                                              onChange(value as string);
                                            }}
                                            options={classOptions}
                                            value={
                                              classOptions.find(
                                                (c) => c.value === value
                                              ) || null
                                            }
                                            placeholder="Évfolyam"
                                            text="text-primaryDark"
                                            bg="bg-application1"
                                            error={!!error}
                                            disabled={closed}
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.finishedSemester`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => (
                                          <Select
                                            onChange={(
                                              value: string | number
                                            ) => {
                                              onChange(value as string);
                                            }}
                                            options={semesterOptions}
                                            value={
                                              semesterOptions.find(
                                                (c) => c.value === value
                                              ) || null
                                            }
                                            placeholder="Elvégzett félévek száma"
                                            text="text-primaryDark"
                                            bg="bg-application1"
                                            error={!!error}
                                            disabled={closed}
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.email`}
                                        rules={{
                                          required: true,
                                          pattern: {
                                            value:
                                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Helytelen email",
                                          },
                                        }}
                                        control={projectsControl}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <div className="flex flex-col">
                                            <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                                              E-mail cím
                                            </span>
                                            <input
                                              {...field}
                                              autoComplete="off"
                                              disabled={
                                                !!defaultValues || closed
                                              }
                                              type="text"
                                              className={classNames(
                                                inputClasses,
                                                error
                                                  ? "ring ring-red-700"
                                                  : "",
                                                ""
                                              )}
                                              placeholder="E-mail cím"
                                            />
                                          </div>
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.mobileNumber`}
                                        rules={{
                                          required: true,
                                          pattern: {
                                            value:
                                              /^(\+\d{1,2}\s?)?\(?\d{4}\)?[\s.-]?\d{3}[\s.-]?\d{3}$/,
                                            message: "Helytelen telefonszám",
                                          },
                                        }}
                                        control={projectsControl}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <div className="flex flex-col">
                                            <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                                              Telefonszám
                                            </span>
                                            <input
                                              {...field}
                                              autoComplete="off"
                                              type="text"
                                              className={classNames(
                                                inputClasses,
                                                error
                                                  ? "ring ring-red-700"
                                                  : "",
                                                ""
                                              )}
                                              placeholder="Telefonszám"
                                              disabled={closed}
                                            />
                                          </div>
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.idPhoto`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => {
                                          return (
                                            <div className="flex flex-col">
                                              <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                                                Hallgatói jogviszonyt igazoló
                                                dokumentum
                                              </span>

                                              <label>
                                                <div
                                                  className={classNames(
                                                    inputClasses,
                                                    error
                                                      ? "ring ring-red-700"
                                                      : "",
                                                    "flex cursor-pointer items-center gap-2"
                                                  )}
                                                >
                                                  <div className="overflow-hidden truncate opacity-80">
                                                    {value &&
                                                    typeof value === "object"
                                                      ? value.name
                                                      : typeof value ===
                                                        "string"
                                                      ? value
                                                      : "Kép az ellenőrző első két oldaláról"}
                                                  </div>
                                                </div>
                                                <input
                                                  type="file"
                                                  autoComplete="off"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const fileSize =
                                                      e.target.files &&
                                                      e.target.files[0]
                                                        ? Math.round(
                                                            (e.target.files[0]
                                                              .size || 0) / 1024
                                                          )
                                                        : null;

                                                    if (
                                                      fileSize &&
                                                      fileSize >= 4096
                                                    ) {
                                                      projectSetErrors(
                                                        `projects.${index}.companions.${ci}.idPhoto`,
                                                        {
                                                          type: "custom",
                                                          message:
                                                            "Kép mérete max. 4mb",
                                                        }
                                                      );
                                                    } else {
                                                      projectCleanErrors(
                                                        `projects.${index}.companions.${ci}.idPhoto`
                                                      );
                                                      onChange(
                                                        e.target.files
                                                          ? e.target.files[0]
                                                          : null
                                                      );
                                                    }
                                                  }}
                                                  disabled={closed}
                                                />
                                              </label>
                                              {error &&
                                                error.type === "custom" && (
                                                  <p className="pl-1 pt-1 font-open text-xs font-medium text-red-600">
                                                    {error.message}
                                                  </p>
                                                )}
                                            </div>
                                          );
                                        }}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.voucher`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => {
                                          return (
                                            <div className="flex flex-col">
                                              <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
                                                Kifizetési bizonylat
                                              </span>

                                              <label>
                                                <div
                                                  className={classNames(
                                                    inputClasses,
                                                    error
                                                      ? "ring ring-red-700"
                                                      : "",
                                                    "flex cursor-pointer items-center gap-2"
                                                  )}
                                                >
                                                  <div className="overflow-hidden truncate opacity-80">
                                                    {value &&
                                                    typeof value === "object"
                                                      ? value.name
                                                      : typeof value ===
                                                        "string"
                                                      ? value
                                                      : "Kifizetési bizonylat"}
                                                  </div>
                                                </div>
                                                <input
                                                  type="file"
                                                  autoComplete="off"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    projectCleanErrors(
                                                      `projects.${index}.companions.${ci}.voucher`
                                                    );
                                                    onChange(
                                                      e.target.files
                                                        ? e.target.files[0]
                                                        : null
                                                    );
                                                  }}
                                                  disabled={closed}
                                                />
                                              </label>
                                            </div>
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              </Transition>
                            </>
                          )}
                        </Disclosure>
                      </React.Fragment>
                    ))}
                    {!defaultValues && !closed && (
                      <div className="mt-4 flex space-x-2">
                        <AddCompanionButton index={index} />
                        <AddAdvisorButton index={index} />
                      </div>
                    )}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}

        {!defaultValues && (
          <button
            className="ml-3 inline-flex items-center gap-2 rounded-xl border border-[#2c1728]/15 bg-white px-4 py-2.5 font-open text-sm font-semibold text-[#2c1728] transition-colors hover:border-[#d4af6a] hover:bg-[#faf7f4] md:mr-6"
            onClick={() =>
              append({
                advisors: [
                  {
                    name: "",
                    email: "",
                    title: "",
                    university: "",
                    universityOther: undefined,
                    certificate: null,
                  },
                ],
                title: "",
                extract: null,
                section: "",
                contribution: null,
                annex: null,
                essay: null,
              })
            }
          >
            <PlusIcon className="h-4 w-4 text-[#d4af6a]" />
            <p>Új dolgozat hozzáadása</p>
          </button>
        )}
      </div>
      {!defaultValues && (
        <div className="mt-16 mb-4 flex items-start gap-3 rounded-xl border border-[#2c1728]/10 bg-white p-4 md:max-w-[560px]">
          <input
            type="checkbox"
            value={`${gdprApproved}`}
            onChange={(e) => setGdprApproved(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#2c1728]"
          />
          <p className="font-open text-sm leading-6 text-[#2c1728]">
            A <b>Mentés</b> gombra való kattintáshoz el kell fogadd a{" "}
            <b
              className="cursor-pointer text-[#a77f35] transition-colors hover:text-[#2c1728]"
              onClick={() => setGdprDialog(true)}
            >
              <u>feltételeket</u>
            </b>
            .
          </p>
        </div>
      )}
      {!closed && (
        <button
          className={classNames(
            !!defaultValues ? "mt-10" : "",
            "flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2c1728] px-8 font-open text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_25px_rgba(44,23,40,0.25)] transition-colors hover:bg-[#4a2940] disabled:cursor-not-allowed disabled:bg-[#2c1728]/25 disabled:shadow-none"
          )}
          onClick={() => submitData()}
          disabled={
            !!Object.keys(projectErrors).length ||
            !!Object.keys(personErrors).length ||
            !gdprApproved ||
            saving
          }
        >
          <p>Mentés</p>
        </button>
      )}

      {(!!Object.keys(projectErrors).length ||
        !!Object.keys(personErrors).length) && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-red-500" />
          <p className="font-open text-sm font-medium text-red-600">
            Ellenőrizd, hogy minden adat helyesen van bevezetve.
          </p>
        </div>
      )}

      <Transition.Root show={confirmDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setConfirmDialog(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="relative flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[#f6efe6] p-6 text-center shadow-xl transition-all sm:p-8">
                  <p className="font-bebas text-2xl uppercase tracking-wide text-[#2c1728] sm:text-3xl">
                    Biztos a kitöltött adatok helyességében?
                  </p>
                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      className="rounded-lg border border-[#2c1728]/20 bg-white px-5 py-2.5 font-open text-sm font-semibold text-[#2c1728] transition-colors hover:bg-[#efe6da]"
                      onClick={() => setConfirmDialog(false)}
                    >
                      Mégse
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-[#2c1728] px-5 py-2.5 font-open text-sm font-semibold text-white transition-colors hover:bg-[#4a2940]"
                      onClick={() => {
                        setConfirmDialog(false);
                        onSubmit();
                      }}
                    >
                      Elfogadás
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {gdpr && (
        <Transition.Root show={gdprDialog} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setGdprDialog(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="relative flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative flex max-h-[85vh] w-full max-w-2xl transform flex-col overflow-hidden rounded-2xl bg-[#f6efe6] p-6 text-left shadow-xl transition-all sm:p-8">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <span className="font-bebas text-2xl uppercase tracking-wide text-[#2c1728] sm:text-3xl">
                        Adatkezelési feltételek
                      </span>
                      <button
                        type="button"
                        className="shrink-0 cursor-pointer text-[#2c1728]"
                        onClick={() => setGdprDialog(false)}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="prose prose-neutral max-w-none overflow-y-auto pr-1">
                      <RichText blocks={gdpr} />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}

      <Transition.Root show={confirmationMessage !== ""} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setConfirmationMessage("");
            router.push("/");
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="relative flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[#f6efe6] p-6 text-center shadow-xl transition-all sm:p-8">
                  <CheckBadgeIcon className="mx-auto h-12 w-12 text-[#d4af6a]" />
                  <p className="mt-3 font-bebas text-2xl uppercase tracking-wide text-[#2c1728] sm:text-3xl">
                    Sikeres jelentkezés
                  </p>
                  <div className="mt-4 rounded-xl border border-[#2c1728]/10 bg-white px-4 py-3">
                    <p className="font-open text-[11px] font-bold uppercase tracking-[0.14em] text-[#a58d90]">
                      Jelszó
                    </p>
                    <p className="mt-1 font-open text-lg font-bold text-[#2c1728]">
                      {confirmationMessage}
                    </p>
                  </div>
                  <p className="mt-4 font-open text-sm leading-6 text-[#766561]">
                    Ezt jegyezd le, a későbbiekben ennek a segítségével tudod
                    majd a feltöltőtt adatokat kiegészíteni.
                  </p>
                  <button
                    type="button"
                    className="mt-6 w-full rounded-lg bg-[#2c1728] px-5 py-2.5 font-open text-sm font-semibold text-white transition-colors hover:bg-[#4a2940]"
                    onClick={() => {
                      setConfirmationMessage("");
                      router.push("/");
                    }}
                  >
                    Bezárás
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ApplicationForm;
