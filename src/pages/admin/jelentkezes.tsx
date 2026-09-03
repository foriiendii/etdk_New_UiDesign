import {
  getPersonDataForParticipant,
  getProjectsDataForParticipant,
  queryActiveSections,
  queryAllDeadline,
  queryFaculties,
  queryGeneral,
  querySubjects,
  queryUniversities,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import { sortByHungarianName } from "@utils/sortByHungarianName";
import { isAfter, parseISO } from "date-fns";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

import ApplicationForm from "src/components/ApplicationForm";
import AdminShell from "src/components/AdminShell";
import {
  PersonInputs,
  ProjectInputs,
} from "src/components/ApplicationForm/constants";
import type {
  FacultySanity,
  SanityDeadlines,
  SectionsSanity,
  UniversitiesSanity,
} from "types";

const AdminJelentkezes = ({
  universities,
  faculties,
  sections,
  participantData,
  deadlines,
  paymentLink,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  sections: SectionsSanity[];
  participantData: {
    personData: PersonInputs;
    projectsData: ProjectInputs[];
  };
  deadlines: SanityDeadlines;
  paymentLink?: string;
}) => {
  if (!Object.keys(participantData).length) {
    return (
      <AdminShell
        title="Jelentkezésem"
        description="Töltsd fel és tartsd naprakészen a jelentkezésedhez szükséges személyes adatokat és dokumentumokat."
      >
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-[#2c1728]/20 bg-white px-6 text-center">
          <p className="font-open text-lg text-[#766561]">Nincs kitöltött adatod.</p>
        </div>
      </AdminShell>
    );
  }
  return (
    <AdminShell
      title="Jelentkezésem"
      description="Töltsd fel és tartsd naprakészen a jelentkezésedhez szükséges személyes adatokat és dokumentumokat."
    >
      <ApplicationForm
        universities={universities}
        faculties={faculties}
        sections={sections}
        defaultValues={participantData}
        paymentLink={paymentLink}
        closed={isAfter(
          new Date(),
          parseISO(`${deadlines.documentUploadEnd}T23:59:59`)
        )}
      />
    </AdminShell>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { preview } = ctx;
  const universities = await getClient(preview || false).fetch(
    queryUniversities
  );
  const faculties = await getClient(preview || false).fetch(queryFaculties);
  const subjects = await getClient(preview || false).fetch(querySubjects);
  const sections = await getClient(preview).fetch(queryActiveSections);
  const deadlines = await getClient(preview).fetch(queryAllDeadline);
  const generals = await getClient(preview || false).fetch(queryGeneral);

  const session = await getSession(ctx);

  // if not logged in
  if (!session?.user || !session.user.email) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  // if they scorer or admins go to check
  if (session.user.role !== "participant") {
    return {
      redirect: {
        destination: "/admin/ellenorzes",
        permanent: false,
      },
    };
  }
  const defaultParticipantPersonData: PersonInputs[] = await getClient(
    true
  ).fetch(getPersonDataForParticipant(session.user.email));
  const personDataIfAdditional = {
    ...defaultParticipantPersonData[0],
    ...(!defaultParticipantPersonData?.[0]?.university && {
      university: "additional",
    }),
    ...(!defaultParticipantPersonData?.[0]?.faculty && {
      faculty: "additional",
    }),
    ...(!defaultParticipantPersonData?.[0]?.subject && {
      subject: "additional",
    }),
  };
  const defaultParticipantProjectsData: ProjectInputs[] = await getClient(
    true
  ).fetch(getProjectsDataForParticipant(session.user.email));
  const projectsData = defaultParticipantProjectsData.map((project) => {
    const projectCompanionsAdditional = project.companions
      ? project.companions.map((companion) => ({
          ...companion,
          ...(!companion.university && {
            university: "additional",
          }),
          ...(!companion.faculty && {
            faculty: "additional",
          }),
          ...(!companion.subject && {
            subject: "additional",
          }),
        }))
      : [];
    const projectAdvisors = project.advisors.map((advisor) => ({
      ...advisor,
      ...(!advisor.university && {
        university: "additional",
      }),
    }));
    return {
      ...project,
      companions: projectCompanionsAdditional,
      advisors: projectAdvisors,
    };
  });
  return {
    props: {
      universities,
      faculties,
      subjects,
      sections: sortByHungarianName(sections),
      deadlines: deadlines[0],
      participantData:
        !!defaultParticipantPersonData.length &&
        !!defaultParticipantProjectsData.length
          ? {
              personData: personDataIfAdditional,
              projectsData: projectsData,
            }
          : {},
      preview: preview || false,
      paymentLink: generals[0]?.paymentLink || null,
    },
  };
}

export default AdminJelentkezes;
