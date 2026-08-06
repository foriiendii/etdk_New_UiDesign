import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import MaterialReactTable from "material-react-table";
import type { GetServerSidePropsContext } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { useMemo } from "react";
import type {
  SanityAdvisorData,
  SanityParticipant,
  SanityPersonData,
} from "types";
import { Switch } from "@headlessui/react";
import useSWR from "swr";
import { fetcher } from "@lib/queries";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import toast from "react-hot-toast";
import Link from "next/link";

const headersParticipant = {
  name: "Név",
  idNumber: "Ellenőrző szám",
  university: "Egyetem",
  faculty: "Kar",
  subject: "Szak",
  degree: "Képzési szint",
  class: "Évfolyam",
  finishedSemester: "Elvégzett félévek száma",
  email: "Email",
  mobileNumber: "Telefonszám",
  idPhoto: "Ellenőrző kép",
  voucher: "Kifizetési bizonylat",
  registrationDate: "Regisztráció dátuma",
};

const headersAdvisor = {
  name: "Témavezető név",
  university: "Témavezető egyetem",
  title: "Témavezető titulus",
  email: "Témavezető email",
  certificate: "Témavezető igazolás",
};

const headersProject = {
  title: "Dolgozat cím",
  section: "Szekció",
  extract: "Kivonat",
  essay: "Dolgozat",
  annex: "Melléklet",
  contribution: "Hozzájárulási nyilatkozat",
  score: "Pontszám",
  otdk_nominated: "Jelölve OTDKra",
  // publish_nominated: "Jelölve publikálásra",
};

const EllenorzoFelulet = () => {
  const {
    data: allParticipantData,
    mutate,
    isLoading,
  } = useSWR<SanityParticipant[]>(
    "/participants_data",
    async () =>
      await fetcher(`/participants`).then((r) => (Array.isArray(r) ? r : []))
  );
  const { data } = useSession();

  const columns = useMemo<MRT_ColumnDef<SanityParticipant>[]>(() => {
    const participantHeaders: MRT_ColumnDef<SanityParticipant>[] = Object.keys(
      headersParticipant
    ).map((key) => {
      return {
        accessorFn: (row: SanityParticipant) => {
          const newKey =
            key === "university" && !row.university
              ? "universityOther"
              : key === "faculty" && !row.faculty
              ? "facultyOther"
              : key === "subject" && !row.subject
              ? "subjectOther"
              : key === "idPhoto"
              ? "idPhoto.originalFilename"
              : key === "voucher"
              ? "voucher.originalFilename"
              : key;
          const data = row[newKey as keyof SanityParticipant];
          return key === "registrationDate"
            ? (data as string).split("T")[0]
            : data;
        },
        header: headersParticipant[key as keyof typeof headersParticipant],
        ...((key === "idPhoto" || key === "voucher") && {
          Cell: ({ row }) => (
            <>
              {row.original[key]?.url && row.original[key]?.originalFilename ? (
                <a
                  href={row.original[key].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {row.original[key].originalFilename}
                </a>
              ) : null}
            </>
          ),
        }),
      };
    });
    const advisorHeaders: MRT_ColumnDef<SanityParticipant>[] = [
      0, 1, 2, 3,
    ].reduce((acc, i) => {
      return [
        ...acc,
        ...Object.keys(headersAdvisor).map((key) => {
          return {
            accessorFn: (row: SanityParticipant) => {
              const newKey =
                key === "university" && !row.advisors?.[i]?.university
                  ? "universityOther"
                  : key === "certificate"
                  ? "certificate.originalFilename"
                  : key;
              return row.advisors?.[i]?.[newKey as keyof SanityAdvisorData]
                ? row.advisors?.[i]?.[newKey as keyof SanityAdvisorData]
                : null;
            },
            header: `${i + 1}. ${
              headersAdvisor[key as keyof typeof headersAdvisor]
            }`,
            ...(key === "certificate" && {
              Cell: ({ row }: { row: { original: SanityParticipant } }) => (
                <>
                  {row.original.advisors?.[i]?.certificate?.url &&
                  row.original.advisors?.[i]?.certificate?.originalFilename ? (
                    <a
                      href={row.original.advisors?.[i]?.certificate.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.original.advisors?.[i]?.certificate.originalFilename}
                    </a>
                  ) : null}
                </>
              ),
            }),
          };
        }),
      ];
    }, [] as MRT_ColumnDef<SanityParticipant>[]);

    const companionsHeaders: MRT_ColumnDef<SanityParticipant>[] = [
      0, 1, 2, 3,
    ].reduce((acc, i) => {
      return [
        ...acc,
        ...Object.keys(headersParticipant).map((key) => {
          return {
            accessorFn: (row: SanityParticipant) => {
              const newKey =
                key === "university" && !row.companions?.[i]?.university
                  ? "universityOther"
                  : key === "faculty" && !row.companions?.[i]?.faculty
                  ? "facultyOther"
                  : key === "subject" && !row.companions?.[i]?.subject
                  ? "subjectOther"
                  : key === "idPhoto"
                  ? "idPhoto.originalFilename"
                  : key === "idPhoto"
                  ? "voucher.originalFilename"
                  : key;
              return row.companions?.[i]?.[newKey as keyof SanityPersonData]
                ? row.companions?.[i]?.[newKey as keyof SanityPersonData]
                : null;
            },
            header: `${i + 1}. Társszerző ${headersParticipant[
              key as keyof typeof headersParticipant
            ].toLowerCase()}`,
            ...((key === "idPhoto" || key === "voucher") && {
              Cell: ({ row }: { row: { original: SanityParticipant } }) => (
                <>
                  {row.original.companions?.[i]?.[key]?.url &&
                  row.original.companions?.[i]?.[key]?.originalFilename ? (
                    <a
                      href={row.original.companions?.[i]?.[key].url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.original.companions?.[i]?.[key].originalFilename}
                    </a>
                  ) : null}
                </>
              ),
            }),
          };
        }),
      ];
    }, [] as MRT_ColumnDef<SanityParticipant>[]);

    const projectHeaders: MRT_ColumnDef<SanityParticipant>[] = Object.keys(
      headersProject
    ).map((key) => {
      return {
        accessorFn: (row) =>
          row[
            key === "extract"
              ? ("extract.originalFilename" as keyof SanityParticipant)
              : key === "annex"
              ? ("annex.originalFilename" as keyof SanityParticipant)
              : key === "contribution"
              ? ("contribution.originalFilename" as keyof SanityParticipant)
              : key === "essay"
              ? ("essay.originalFilename" as keyof SanityParticipant)
              : key === "section" && row.merged_section
              ? ("merged_section" as keyof SanityParticipant)
              : (key as keyof SanityParticipant)
          ],

        header: headersProject[key as keyof typeof headersProject],
        ...((key === "extract" ||
          key === "annex" ||
          key === "contribution" ||
          key === "essay") && {
          Cell: ({ row }: { row: { original: SanityParticipant } }) => (
            <>
              {row.original?.[key]?.url &&
              row.original?.[key]?.originalFilename ? (
                <a
                  href={row.original[key].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {row.original[key].originalFilename}
                </a>
              ) : null}
            </>
          ),
        }),
        ...((key === "otdk_nominated" || key === "publish_nominated") && {
          Cell: ({ row }: { row: { original: SanityParticipant } }) => (
            <>{row.original?.[key] ? "Igen" : "Nem"}</>
          ),
        }),
      };
    });

    const acceptParticipant = async (userData: SanityParticipant) =>
      await fetcher(
        `/participants/accept`,
        JSON.stringify({
          id: userData._id,
          currentValue: userData.accepted,
        })
      ).then(() => mutate());

    const acceptedHeader: MRT_ColumnDef<SanityParticipant> = {
      accessorKey: "accepted",
      header: "Elfogadva",
      Cell: ({ row }) => (
        <Switch
          checked={row.original.accepted}
          onChange={async () =>
            toast.promise(acceptParticipant(row.original), {
              loading: "Elfogadás...",
              success: <b>Elfogadás sikeres</b>,
              error: <b>Elfogadás sikertelen</b>,
            })
          }
          className={`${
            row.original.accepted ? "bg-primaryLight" : "bg-lightBrown"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              row.original.accepted ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      ),
    };
    return [
      ...participantHeaders,
      ...advisorHeaders,
      ...companionsHeaders,
      ...projectHeaders,
      acceptedHeader,
    ];
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="align-center flex min-h-[100vh] min-w-full items-center justify-center p-4 pt-[100px]">
        <svg
          aria-hidden="true"
          className="mr-2 h-28 w-28 animate-spin fill-white text-primaryLight dark:text-primaryLight"
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
    );
  }

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true,
    filename: "ETDK_resztvevok",
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows: MRT_Row<SanityParticipant>[]) => {
    const generateNewRows = rows.map((row) =>
      Object.entries(row._valuesCache)
        .map((cachedRow) => {
          const cachedRowKey = cachedRow[0];
          if (cachedRowKey.includes("Kivonat")) {
            return {
              [cachedRowKey]: row.original.extract?.originalFilename || null,
            };
          }
          if (cachedRowKey === "Dolgozat") {
            return {
              [cachedRowKey]: row.original.essay?.originalFilename || null,
            };
          }
          if (cachedRowKey.includes("Melléklet")) {
            return {
              [cachedRowKey]: row.original.annex?.originalFilename || null,
            };
          }
          if (cachedRowKey.includes("Hozzájárulási nyilatkozat")) {
            return {
              [cachedRowKey]:
                row.original.contribution?.originalFilename || null,
            };
          }

          if (
            cachedRowKey.includes("ellenőrző kép") ||
            cachedRowKey.includes("Ellenőrző kép")
          ) {
            const index = cachedRowKey[0];
            if (index && parseInt(index)) {
              return {
                [cachedRowKey]:
                  row.original.companions?.[parseInt(index) - 1]?.idPhoto
                    ?.originalFilename || null,
              };
            } else {
              return {
                [cachedRowKey]: row.original.idPhoto?.originalFilename || null,
              };
            }
          }
          if (cachedRowKey.includes("Kifizetési bizonylat")) {
            const index = cachedRowKey[0];
            if (index && parseInt(index)) {
              return {
                [cachedRowKey]:
                  row.original.companions[parseInt(index) - 1]?.voucher
                    ?.originalFilename || null,
              };
            } else {
              return {
                [cachedRowKey]: row.original.voucher?.originalFilename || null,
              };
            }
          }
          if (cachedRowKey.includes("Témavezető igazolás")) {
            const index = cachedRowKey[0];
            if (index && parseInt(index)) {
              return {
                [cachedRowKey]:
                  row.original.advisors[parseInt(index) - 1]?.certificate
                    ?.originalFilename || null,
              };
            }
          }
          return { [cachedRowKey]: cachedRow[1] };
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})
    );
    csvExporter.generateCsv(generateNewRows);
  };

  return (
    <div className="ellenorzes min-h-[100vh] min-w-full pt-[100px] text-white">
      <div className="flex w-full">
        <div className="flex-1">
          {data?.user.role === "superadmin" && (
            <Button sx={{ mb: 4 }} variant="contained">
              <Link href="pontozas">Pontozás</Link>
            </Button>
          )}
        </div>
        <Button sx={{ mb: 4 }} variant="contained" onClick={() => signOut()}>
          Kijelentkezés
        </Button>
      </div>
      {!!allParticipantData && (
        <MaterialReactTable
          columns={columns}
          data={allParticipantData}
          renderTopToolbarCustomActions={({ table }) => (
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={() => {
                handleExportRows(table.getPrePaginationRowModel().rows);
              }}
              startIcon={<FileDownloadIcon />}
              variant="contained"
              className="bg-blue-700"
            >
              Export
            </Button>
          )}
        />
      )}
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

  if (
    session.user.role === "section_closer" ||
    session.user.role === "scorer"
  ) {
    return {
      redirect: {
        destination: "/admin/pontozas",
        permanent: false,
      },
    };
  }

  return {
    props: {
      preview: preview || false,
    },
  };
}

export default EllenorzoFelulet;
