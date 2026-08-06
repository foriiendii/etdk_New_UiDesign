import Download from "@mui/icons-material/Download";
import ExpandMore from "@mui/icons-material/ExpandMore";

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
import { getSession, signOut, useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import useSWR from "swr";
import type {
  SanityDeadlines,
  SanityParticipant,
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
import JSZip from "jszip";
import { useRouter } from "next/router";
import Link from "next/link";

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

const fileAttributes: (keyof Pick<
  SanityParticipant,
  "extract" | "annex" | "contribution" | "essay"
>)[] = ["extract", "annex", "contribution", "essay"];

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
  const closeSection = async () =>
    await fetcher(
      `/sections/close`,
      JSON.stringify({
        id: sections[tabValue]!._id,
      })
    ).then(() => router.reload());

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
    () => sections[tabValue]!.closed,
    [sections, tabValue]
  );

  const filesDownload = async (selectedUser: SanityParticipantScoring) => {
    try {
      const zip = new JSZip();
      const folder = zip.folder(`${selectedUser.name}`);
      fileAttributes.forEach((attribute) => {
        if (folder && selectedUser[attribute]) {
          folder.file(
            selectedUser[attribute].originalFilename,
            fetch(selectedUser[attribute].url).then((res) => res.blob())
          );
        }
      });
      const zipFile = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipFile);
      a.download = `${selectedUser.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[100vh] min-w-full p-4 pt-[100px]">
      <div className="flex w-full">
        <div className="flex-1">
          {session.data?.user.role === "superadmin" && (
            <Button variant="contained" sx={{ mb: 4 }}>
              <Link href="ellenorzes">Ellenőrzés</Link>
            </Button>
          )}
        </div>
        <Button
          sx={{ mb: 4 }}
          variant="contained"
          color="primary"
          onClick={() => signOut()}
        >
          Kijelentkezés
        </Button>
      </div>
      <div className="relative mx-auto w-full max-w-4xl md:flex md:w-3/4 md:flex-col">
        <Autocomplete
          onChange={(_e, value) => {
            setTabValue(value?.value || 0);
          }}
          options={sections}
          getOptionLabel={(option) => option.name}
          value={sections[tabValue] || null}
          renderInput={(params) => <TextField {...params} label="Szekció" />}
          sx={{ width: "100%", mb: 4 }}
        />
        {session.data?.user.role !== "scorer" && !selectedSectionClosed && (
          <Button
            onClick={closeSection}
            sx={{ mb: 4, width: "100%" }}
            variant="contained"
          >
            Szekció zárása
          </Button>
        )}

        {isLoading && (
          <div className="flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="mr-2 h-14 w-14 animate-spin fill-white text-primaryLight dark:text-primaryLight"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {sectionParticipantsData &&
          sectionParticipantsData.map((participant) => (
            <Accordion key={participant._id}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ display: "flex" }}
              >
                <Typography className="self-center" sx={{ flex: 1 }}>
                  {participant.name}
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<Download />}
                  className="bg-primaryDark"
                  sx={{ mr: 2 }}
                  onClick={() => filesDownload(participant)}
                >
                  Dokumentumok letöltése
                </Button>
              </AccordionSummary>
              <AccordionDetails>
                {sections && sections[tabValue] && (
                  <ParticipantScoring
                    criteria={
                      sectionsDefault.find(
                        (s) => s._id === participant.section._id
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
    </div>
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
