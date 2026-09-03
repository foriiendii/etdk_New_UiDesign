import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import MaterialReactTable from "material-react-table";
import type { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
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
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ExportToCsv } from "export-to-csv";
import toast from "react-hot-toast";
import AdminShell from "src/components/AdminShell";

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

const documentLabels = [
  ["idPhoto", "Személyi igazolvány"],
  ["voucher", "Kifizetési bizonylat"],
  ["extract", "Kivonat"],
  ["essay", "Dolgozat"],
  ["annex", "Melléklet"],
  ["contribution", "Hozzájárulási nyilatkozat"],
] as const;

const formatDate = (value?: string) =>
  value ? value.split("T")[0] : "Nincs megadva";

const hungarianLocalization = {
  actions: "Műveletek",
  cancel: "Mégse",
  changeFilterMode: "Szűrés módjának módosítása",
  changeSearchMode: "Keresési mód módosítása",
  clearFilter: "Szűrő törlése",
  clearSearch: "Keresés törlése",
  clearSort: "Rendezés törlése",
  clickToCopy: "Kattints a másoláshoz",
  collapse: "Bezárás",
  collapseAll: "Összes bezárása",
  columnActions: "Oszlopműveletek",
  copiedToClipboard: "Vágólapra másolva",
  edit: "Szerkesztés",
  expand: "Megnyitás",
  expandAll: "Összes megnyitása",
  filterByColumn: "{column}",
  filterContains: "Tartalmazza",
  filterEmpty: "Üres",
  filterEndsWith: "Ezzel végződik",
  filterEquals: "Egyenlő",
  filterFuzzy: "Hasonló",
  filterGreaterThan: "Nagyobb, mint",
  filterGreaterThanOrEqualTo: "Nagyobb vagy egyenlő",
  filterInNumberRange: "Tartomány",
  filterIncludesString: "Tartalmazza",
  filterLessThan: "Kisebb, mint",
  filterLessThanOrEqualTo: "Kisebb vagy egyenlő",
  filterMode: "Szűrés módja: {filterType}",
  filterNotEmpty: "Nem üres",
  filterNotEquals: "Nem egyenlő",
  filterStartsWith: "Ezzel kezdődik",
  filteringByColumn: "Szűrés: {column} - {filterType} {filterValue}",
  goToFirstPage: "Első oldal",
  goToLastPage: "Utolsó oldal",
  goToNextPage: "Következő oldal",
  goToPreviousPage: "Előző oldal",
  hideAll: "Összes elrejtése",
  hideColumn: "{column} oszlop elrejtése",
  max: "Maximum",
  min: "Minimum",
  noRecordsToDisplay: "Nincs megjeleníthető adat",
  noResultsFound: "Nincs találat",
  of: "/",
  or: "vagy",
  pinToLeft: "Rögzítés balra",
  pinToRight: "Rögzítés jobbra",
  resetOrder: "Sorrend visszaállítása",
  rowActions: "Sorműveletek",
  rowsPerPage: "Sor oldalanként",
  save: "Mentés",
  search: "Keresés",
  selectedCountOfRowCountRowsSelected: "{selectedCount} / {rowCount} sor kijelölve",
  select: "Kijelölés",
  showAll: "Összes megjelenítése",
  showAllColumns: "Összes oszlop megjelenítése",
  showHideColumns: "Oszlopok megjelenítése/rejtése",
  showHideFilters: "Szűrők megjelenítése/rejtése",
  showHideSearch: "Keresés megjelenítése/rejtése",
  sortByColumnAsc: "Rendezés {column} szerint növekvő",
  sortByColumnDesc: "Rendezés {column} szerint csökkenő",
  toggleDensity: "Sűrűség váltása",
  toggleFullScreen: "Teljes képernyő",
  toggleSelectAll: "Összes kijelölése",
  toggleSelectRow: "Sor kijelölése",
  unsorted: "Nincs rendezés",
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
        id: key,
        enableColumnFilter: !["idPhoto", "voucher"].includes(key),
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
            id: `advisor-${i}-${key}`,
            enableColumnFilter: key !== "certificate",
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
            id: `companion-${i}-${key}`,
            enableColumnFilter: !["idPhoto", "voucher"].includes(key),
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
        id: key,
        enableColumnFilter: ![
          "extract",
          "essay",
          "annex",
          "contribution",
          "otdk_nominated",
          "publish_nominated",
        ].includes(key),
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
      enableColumnFilter: false,
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
    <AdminShell
      title="Jelentkezések"
    >
      {!!allParticipantData && (
        <div className="overflow-hidden rounded-2xl border border-[#2c1728]/10 bg-white shadow-[0_16px_45px_rgba(44,23,40,0.08)]">
          <MaterialReactTable
            columns={columns}
            data={allParticipantData}
            enableColumnFilters
            enableGlobalFilter
            enableSorting
            enableColumnResizing={false}
            enableDensityToggle={false}
            enableRowNumbers={false}
            positionExpandColumn="first"
            localization={hungarianLocalization}
            // The expand toggle isn't a real data column - it shouldn't be
            // offered in the show/hide-columns menu, and it's pinned to a
            // fixed width so its sticky offset (and the Név column's, right
            // after it) below stays correct.
            displayColumnDefOptions={{
              "mrt-row-expand": {
                enableHiding: false,
                size: 44,
              },
            }}
            muiExpandAllButtonProps={{
              sx: {
                color: "#d4af6a !important",
                "& svg": {
                  color: "#d4af6a !important",
                  fill: "#d4af6a !important",
                },
                "&:hover": {
                  backgroundColor: "rgba(212,175,106,0.16)",
                  color: "#f4ece9 !important",
                },
              },
            }}
            muiExpandButtonProps={{
              sx: {
                color: "#d4af6a",
                transition: "background-color 160ms, color 160ms",
                "&:hover": {
                  backgroundColor: "rgba(212,175,106,0.16)",
                  color: "#f4ece9",
                },
                "& svg": {
                  color: "inherit",
                },
              },
            }}
            muiTableHeadCellColumnActionsButtonProps={{
              size: "small",
              sx: {
                color: "#d4af6a !important",
                borderRadius: "8px",
                marginLeft: "4px",
                transition: "background-color 160ms, color 160ms",
                "&:hover": {
                  backgroundColor: "rgba(212,175,106,0.18)",
                  color: "#f4ece9 !important",
                },
                "& svg": {
                  color: "inherit !important",
                },
              },
            }}
            muiSearchTextFieldProps={{
              placeholder: "Keresés név vagy e-mail alapján",
              variant: "outlined",
              InputProps: { startAdornment: <SearchIcon fontSize="small" /> },
              sx: {
                minWidth: { xs: "100%", sm: "320px" },
                "& .MuiOutlinedInput-root": {
                  height: "34px",
                  borderRadius: "12px",
                  backgroundColor: "#f5f1ed",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.78rem",
                  color: "#2c1728",
                  "& fieldset": { borderColor: "rgba(44,23,40,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(44,23,40,0.25)" },
                  "&.Mui-focused fieldset": { borderColor: "#d4af6a" },
                },
                "& .MuiInputAdornment-root": { color: "#a58d90" },
              },
            }}
            muiTableHeadCellFilterTextFieldProps={{
              variant: "standard",
              sx: {
                marginTop: "6px",
                "& .MuiInputBase-input": {
                  color: "rgba(255,255,255,0.94)",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  padding: "4px 0 6px",
                },
                "& input": {
                  fontFamily: "Poppins, sans-serif !important",
                  color: "rgba(255,255,255,0.94)",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.62)",
                  opacity: 1,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "rgba(255,255,255,0.35)",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#e7a9b4",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#d4af6a",
                },
                "& .MuiIconButton-root": {
                  color: "rgba(255,255,255,0.65)",
                },
              },
            }}
            muiTopToolbarProps={{
              sx: {
                minHeight: "42px",
                padding: "4px 16px",
                backgroundColor: "#fffdfb",
                borderBottom: "1px solid rgba(44,23,40,0.08)",
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                minHeight: "40px",
                padding: "0 12px",
                "& .MuiTablePagination-root": {
                  minHeight: "40px",
                },
                "& .MuiTablePagination-toolbar": {
                  minHeight: "40px",
                  padding: 0,
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.72rem",
                },
              },
            }}
            muiTablePaginationProps={{
              size: "small",
              SelectProps: { variant: "standard" },
            }}
            initialState={{
              density: "comfortable",
              showGlobalFilter: true,
              columnVisibility: Object.fromEntries(
                columns.map((column) => [
                  column.id,
                  ["name", "email", "section", "registrationDate", "accepted"].includes(
                    column.id || ""
                  ),
                ])
              ),
            }}
            renderDetailPanel={({ row }) => (
              <div className="space-y-6 bg-[#fbf8f5] px-5 py-6">
                <div>
                  <p className="font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">Jelentkező adatai</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ["Ellenőrző szám", row.original.idNumber],
                      ["Egyetem", row.original.university || row.original.universityOther],
                      ["Kar", row.original.faculty || row.original.facultyOther],
                      ["Szak", row.original.subject || row.original.subjectOther],
                      ["Képzési szint", row.original.degree],
                      ["Évfolyam", row.original.class],
                      ["Elvégzett félévek", row.original.finishedSemester],
                      ["E-mail", row.original.email],
                      ["Telefonszám", row.original.mobileNumber],
                      ["Regisztráció dátuma", formatDate(row.original.registrationDate)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-[#2c1728]/10 bg-white px-3 py-3">
                        <p className="font-open text-[10px] uppercase tracking-[0.12em] text-[#a58d90]">{label}</p>
                        <p className="mt-1 truncate font-open text-sm font-semibold text-[#2c1728]">{value || "Nincs megadva"}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <p className="font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">Dolgozat</p>
                    <div className="mt-3 rounded-lg border border-[#2c1728]/10 bg-white p-4">
                      <p className="font-open text-base font-semibold text-[#2c1728]">{row.original.title || "Nincs megadva"}</p>
                      <p className="mt-1 font-open text-sm text-[#766561]">Szekció: {row.original.section || row.original.merged_section || "Nincs megadva"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">Fő dokumentumok</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {documentLabels.map(([key, label]) => {
                        const document = row.original[key as keyof SanityParticipant] as { url?: string; originalFilename?: string } | null;
                        return document?.url ? (
                          <a key={key} href={document.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-[#2c1728]/10 bg-white px-3 py-2.5 font-open text-sm text-[#2c1728] transition-colors hover:border-[#d4af6a]">
                            <span className="truncate">{label}</span><span className="ml-3 shrink-0 text-xs text-[#a58d90]">Megnyitás ↗</span>
                          </a>
                        ) : (
                          <div key={key} className="flex items-center justify-between rounded-lg border border-dashed border-[#2c1728]/10 px-3 py-2.5 font-open text-sm text-[#a58d90]">
                            <span>{label}</span><span className="text-xs">Nincs feltöltve</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">Témavezetők ({row.original.advisors?.length || 0})</p>
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    {(row.original.advisors || []).map((advisor, index) => (
                      <div key={`${advisor.email}-${index}`} className="rounded-lg border border-[#2c1728]/10 bg-white p-4">
                        <p className="font-open text-sm font-semibold text-[#2c1728]">{index + 1}. {advisor.name || "Névtelen témavezető"}</p>
                        <p className="mt-2 font-open text-xs leading-5 text-[#766561]">{advisor.title || "Nincs titulus"} · {advisor.university || advisor.universityOther || "Nincs egyetem"}<br />{advisor.email || "Nincs e-mail"}</p>
                        {advisor.certificate?.url && <a href={advisor.certificate.url} target="_blank" rel="noreferrer" className="mt-3 inline-block font-open text-xs font-semibold text-[#a77f35] hover:text-[#2c1728]">Igazolás megnyitása ↗</a>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">Társszerzők ({row.original.companions?.length || 0})</p>
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    {(row.original.companions || []).map((companion, index) => (
                      <div key={`${companion.email}-${index}`} className="rounded-lg border border-[#2c1728]/10 bg-white p-4">
                        <p className="font-open text-sm font-semibold text-[#2c1728]">{index + 1}. {companion.name || "Névtelen társszerző"}</p>
                        <div className="mt-2 grid gap-1 font-open text-xs leading-5 text-[#766561] sm:grid-cols-2">
                          <span>Ellenőrző szám: {companion.idNumber || "Nincs"}</span><span>Telefon: {companion.mobileNumber || "Nincs"}</span>
                          <span>E-mail: {companion.email || "Nincs"}</span><span>Egyetem: {companion.university || companion.universityOther || "Nincs"}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {([["idPhoto", "Ellenőrző kép"], ["voucher", "Bizonylat"]] as const).map(([key, label]) => {
                            const document = companion[key];
                            return document?.url ? <a key={key} href={document.url} target="_blank" rel="noreferrer" className="rounded-md bg-[#f5f1ed] px-2.5 py-1.5 font-open text-xs font-semibold text-[#a77f35] hover:bg-[#d4af6a]/20">{label} ↗</a> : null;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            muiTablePaperProps={{
              elevation: 0,
              sx: {
                borderRadius: 0,
                "& .MuiTableCell-root": {
                  fontFamily: "Poppins, sans-serif",
                },
                "& .MuiTableBody-root .MuiTableCell-root span": {
                  fontFamily: "Poppins, sans-serif !important",
                  fontSize: "inherit",
                },
                "& input": {
                  fontFamily: "Poppins, sans-serif !important",
                },
              },
            }}
            muiTableHeadCellProps={({ column }) => ({
              sx: {
                backgroundColor: "#2c1728",
                color: "#fff",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.68rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                py: 1,
                "& .MuiIconButton-root": { color: "#d4af6a !important" },
                "& .MuiIconButton-root:hover": { backgroundColor: "rgba(212,175,106,0.16)" },
                // Keep the expand toggle + Név columns in view when the wide
                // table is scrolled horizontally.
                ...(column.id === "mrt-row-expand" && {
                  position: "sticky",
                  left: 0,
                  zIndex: 4,
                  backgroundColor: "#2c1728",
                }),
                ...(column.id === "name" && {
                  position: "sticky",
                  left: 44,
                  zIndex: 4,
                  backgroundColor: "#2c1728",
                  boxShadow: "4px 0 8px -4px rgba(0,0,0,0.35)",
                }),
              },
            })}
            muiTableBodyCellProps={({ column }) => ({
              sx: {
                py: 1,
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.78rem",
                color: "#2c1728",
                ...(column.id === "mrt-row-expand" && {
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  backgroundColor: "#fff",
                }),
                ...(column.id === "name" && {
                  position: "sticky",
                  left: 44,
                  zIndex: 2,
                  backgroundColor: "#fff",
                  boxShadow: "4px 0 8px -4px rgba(44,23,40,0.12)",
                }),
              },
            })}
            muiTableBodyRowProps={{ sx: { "&:hover td": { backgroundColor: "#fbf8f5" }, "& td": { borderColor: "rgba(44,23,40,0.08)" } } }}
            icons={{ ExpandMoreIcon: KeyboardArrowDownIcon }}
            renderTopToolbarCustomActions={({ table }) => (
              <Button
                onClick={() => {
                  handleExportRows(table.getPrePaginationRowModel().rows);
                }}
                startIcon={<FileDownloadIcon />}
                variant="contained"
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "#2c1728",
                  boxShadow: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  height: "34px",
                  padding: "5px 12px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#4a2940",
                    boxShadow: "0 6px 16px rgba(44,23,40,0.18)",
                  },
                }}
              >
                Exportálás
              </Button>
            )}
          />
        </div>
      )}
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
