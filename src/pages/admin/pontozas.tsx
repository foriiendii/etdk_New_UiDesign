import CloseIcon from "@mui/icons-material/Close";
import Download from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { LockClosedIcon } from "@heroicons/react/24/outline";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import type { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import type {
  SanityDeadlines,
  SanityParticipantScoring,
} from "types";
import { ParticipantScoring } from "src/components/AdminComponents/Scoring";
import {
  adminSections,
  fetcher,
  queryAllDeadline,
  querySectionsForScoring,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import { sortByHungarianName } from "@utils/sortByHungarianName";
import { useRouter } from "next/router";
import AdminShell from "src/components/AdminShell";

export type Criteria = {
  _id: string;
  maxScore: number;
  name: string;
  written: boolean;
};

export type Section = {
  _id: string;
  criteria: Criteria[];
  name: string;
  active: boolean;
  closed: boolean;
};

type RespSections = {
  sections:
    | {
        _key: string;
        _ref: string;
        _type: string;
      }[]
    | null;
};

const AdminPontozoFelulet = ({
  sectionsDefault,
  responsibleSections,
  deadlines,
}: {
  sectionsDefault: Section[];
  responsibleSections: Section[];
  deadlines: SanityDeadlines;
}) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const session = useSession();
  const router = useRouter();
  const sections = useMemo(
    () =>
      responsibleSections
        .filter((s) => s.active)
        .map((s, i) => ({
          name: s.name,
          _id: s._id,
          value: i,
          closed: s.closed,
          criteria: s.criteria,
          active: s.active,
        })),
    [responsibleSections]
  );
  const closeSection = async () => {
    const selectedSection = sections[tabValue];
    if (!selectedSection) return;
    await toast.promise(
      fetcher(
        `/sections/close`,
        JSON.stringify({
          id: selectedSection._id,
        })
      ),
      {
        loading: "Szekció lezárása...",
        success: "A szekció sikeresen lezárva.",
        error: "A szekció lezárása sikertelen.",
      }
    );
    router.reload();
  };

  const {
    data: sectionParticipantsData,
    mutate,
    isLoading,
  } = useSWR<SanityParticipantScoring[]>(
    ["/section_participants", tabValue],
    async () =>
      await fetcher(
        `/sections/participants`,
        JSON.stringify({
          id: sections[tabValue]?._id || "",
        })
      ).then((r) => (Array.isArray(r) ? r : []))
  );

  const selectedSectionClosed = useMemo(
    () => sections[tabValue]?.closed || false,
    [sections, tabValue]
  );

  // The zip is now built server-side (POST /api/participants/documents-zip)
  // and streamed back as a blob - fetching cdn.sanity.io/files/... directly
  // from the browser always failed silently, because Sanity doesn't send
  // CORS headers for file assets (only for images).
  const filesDownload = async (selectedUser: SanityParticipantScoring) => {
    const response = await fetch("/api/participants/documents-zip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedUser._id }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(
        body?.message || "A dokumentumok letöltése sikertelen."
      );
    }
    const blob = await response.blob();
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `${selectedUser.name}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canClose = session.data?.user.role !== "scorer";
  const hasParticipants = Boolean(sectionParticipantsData?.length);

  return (
    <AdminShell
      title="Pontozás"
      description="Válassz egy szekciót."
    >
      <div className="mx-auto w-full max-w-4xl">
        {sections.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#2c1728]/20 bg-white px-6 text-center">
            <p className="font-open text-base text-[#766561]">
              Nincs hozzád rendelt szekció.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#2c1728]/10 bg-white p-5 shadow-[0_10px_30px_rgba(44,23,40,0.05)] sm:flex-row sm:items-center sm:p-6">
              <Autocomplete
                onChange={(_e, value) => {
                  setTabValue(value?.value ?? 0);
                }}
                options={sections}
                getOptionLabel={(option) => option.name}
                value={sections[tabValue] || null}
                noOptionsText="Nincs szekció"
                popupIcon={<KeyboardArrowDownIcon sx={{ color: "#d4af6a" }} />}
                clearIcon={
                  <CloseIcon sx={{ fontSize: 17, color: "#a58d90" }} />
                }
                renderInput={(params) => (
                  <TextField {...params} label="Szekció" />
                )}
                componentsProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      borderRadius: "14px",
                      border: "1px solid rgba(44,23,40,0.1)",
                      boxShadow: "0 16px 40px rgba(44,23,40,0.14)",
                      "& .MuiAutocomplete-listbox": {
                        py: 1,
                      },
                      "& .MuiAutocomplete-option": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.88rem",
                        color: "#2c1728",
                        borderRadius: "8px",
                        mx: 1,
                        px: 1.5,
                        py: 1.1,
                        '&[aria-selected="true"]': {
                          backgroundColor: "rgba(212,175,106,0.18)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(44,23,40,0.06)",
                        },
                      },
                      "& .MuiAutocomplete-noOptions": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.85rem",
                        color: "#a58d90",
                      },
                    },
                  },
                }}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.9rem",
                    "& fieldset": { borderColor: "rgba(44,23,40,0.15)" },
                    "&:hover fieldset": { borderColor: "rgba(44,23,40,0.3)" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af6a" },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif",
                    color: "#a58d90",
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#2c1728" },
                }}
              />

              {selectedSectionClosed ? (
                <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#2c1728]/8 px-4 py-3 font-open text-xs font-semibold uppercase tracking-[0.06em] text-[#2c1728] sm:justify-start">
                  <LockClosedIcon className="h-4 w-4" />
                  Szekció lezárva
                </span>
              ) : (
                canClose &&
                sections[tabValue] && (
                  <Button
                    onClick={closeSection}
                    variant="contained"
                    startIcon={<LockClosedIcon className="h-4 w-4" />}
                    sx={{
                      backgroundColor: "#2c1728",
                      borderRadius: "10px",
                      boxShadow: "none",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      py: 1.5,
                      px: 3,
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        backgroundColor: "#4a2940",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Szekció zárása
                  </Button>
                )
              )}
            </div>

            {isLoading && (
              <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-[#2c1728]/10 bg-white">
                <svg
                  aria-hidden="true"
                  className="h-10 w-10 animate-spin text-[#2c1728]/15"
                  style={{ color: "#2c1728" }}
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                    opacity="0.15"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Betöltés...</span>
              </div>
            )}

            {!isLoading && !hasParticipants && (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#2c1728]/20 bg-white px-6 text-center">
                <p className="font-open text-base text-[#766561]">
                  Ebben a szekcióban még nincs elfogadott jelentkező.
                </p>
              </div>
            )}

            {!isLoading && hasParticipants && (
              <div className="overflow-hidden rounded-2xl border border-[#2c1728]/10 bg-white shadow-[0_16px_45px_rgba(44,23,40,0.08)]">
                {sectionParticipantsData!.map((participant) => (
                  <Accordion
                    key={participant._id}
                    disableGutters
                    elevation={0}
                    sx={{
                      backgroundColor: "transparent",
                      borderBottom: "1px solid rgba(44,23,40,0.08)",
                      "&:last-of-type": { borderBottom: "none" },
                      "&:before": { display: "none" },
                      "&.Mui-expanded": { backgroundColor: "#fbf8f5" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <KeyboardArrowDownIcon sx={{ color: "#d4af6a" }} />
                      }
                      sx={{
                        px: { xs: 2.5, sm: 3.5 },
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                          gap: 2,
                          my: 1.75,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          fontSize: "0.92rem",
                          color: "#2c1728",
                        }}
                      >
                        {participant.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Download sx={{ fontSize: 15 }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.promise(filesDownload(participant), {
                            loading: "Dokumentumok előkészítése...",
                            success: "Letöltés elindult.",
                            error: (err) =>
                              err instanceof Error
                                ? err.message
                                : "A dokumentumok letöltése sikertelen.",
                          });
                        }}
                        sx={{
                          borderColor: "rgba(44,23,40,0.15)",
                          color: "#2c1728",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "999px",
                          px: 1.8,
                          py: 0.6,
                          whiteSpace: "nowrap",
                          "&:hover": {
                            borderColor: "#d4af6a",
                            backgroundColor: "rgba(212,175,106,0.08)",
                          },
                        }}
                      >
                        Dokumentumok
                      </Button>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        px: { xs: 2.5, sm: 3.5 },
                        pb: 3,
                        pt: 0,
                      }}
                    >
                      {sections && sections[tabValue] && (
                        <ParticipantScoring
                          criteria={
                            sectionsDefault.find(
                              (s) =>
                                s._id ===
                                (participant.merged_section?._id ||
                                  participant.section?._id)
                            )?.criteria || []
                          }
                          participant={participant}
                          closed={selectedSectionClosed}
                          mutate={mutate}
                        />
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { preview } = ctx;

  const session = await getSession(ctx);
  if (!session?.user || !session.user.email) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  if (session.user.role === "participant") {
    return {
      redirect: {
        destination: "/admin/jelentkezes",
        permanent: false,
      },
    };
  }
  if (session.user.role === "data_checker") {
    return {
      redirect: {
        destination: "/admin/ellenorzes",
        permanent: false,
      },
    };
  }
  const sectionsDefault = (await getClient(true).fetch(
    querySectionsForScoring
  )) as Section[];
  const responsibleSections = (
    await getClient(true).fetch(adminSections(session.user.email))
  )[0] as RespSections;
  const sections =
    session.user.role === "superadmin"
      ? sectionsDefault
      : responsibleSections.sections && responsibleSections.sections.length
      ? sectionsDefault.filter((sect) =>
          responsibleSections.sections!.find((refs) => refs._ref === sect._id)
        )
      : [];
  const deadlines = await getClient(preview).fetch(queryAllDeadline);

  return {
    props: {
      sectionsDefault: sortByHungarianName(
        sectionsDefault.filter((s) => s.name && !s._id.includes("drafts"))
      ),
      responsibleSections: sortByHungarianName(
        sections.filter((s) => s.name && !s._id.includes("drafts"))
      ),
      deadlines: deadlines[0],
      preview: preview || false,
    },
  };
}

export default AdminPontozoFelulet;
