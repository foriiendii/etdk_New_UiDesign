import { querySchedule } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";
import type { SanityScheduleItem } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";
import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  schedule: SanityRichText[];
  scheduleItems: SanityScheduleItem[];
};

const blockText = (block: SanityRichText) =>
  (block.children || []).map((child) => child.text || "").join("");

const ScheduleSearch = ({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => (
  <div className={`flex flex-col ${className}`}>
    <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
      
    </span>
    <div className="relative sm:w-[300px]">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a58d90]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Keresés..."
        className="h-12 w-full rounded-xl border border-[#2c1728]/15 bg-white pl-11 pr-10 font-open text-sm text-[#2c1728] shadow-[0_8px_20px_rgba(44,23,40,0.05)] outline-none transition-colors placeholder:text-[#a58d90] focus:border-[#d4af6a] focus:ring-2 focus:ring-[#d4af6a]/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Keresés törlése"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a58d90] transition-colors hover:text-[#2c1728]"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);

const ResultCount = ({ count }: { count: number }) => (
  <span
    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 font-open text-xs font-semibold ${
      count > 0
        ? "border-[#d4af6a]/40 bg-[#fbf2df] text-[#8a6a26]"
        : "border-[#2c1728]/10 bg-white text-[#a58d90]"
    }`}
  >
    {count > 0 ? `${count} találat` : "Nincs találat"}
  </span>
);

const Program = ({ schedule, scheduleItems }: Props) => {
  const days = Array.from(new Set(scheduleItems.map((item) => item.day)));
  const [selectedDay, setSelectedDay] = useState(days[0] || "");
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;
  const hasStructuredSchedule = scheduleItems.length > 0;

  const visibleItems = isSearching
    ? scheduleItems.filter((item) =>
        [item.title, item.location, item.description]
          .filter((field): field is string => !!field)
          .some((field) => field.toLowerCase().includes(normalizedSearch))
      )
    : scheduleItems.filter((item) => item.day === selectedDay);

  const visibleSchedule = isSearching
    ? schedule.filter((block) =>
        blockText(block).toLowerCase().includes(normalizedSearch)
      )
    : schedule;

  return (
    <PageShell
      number="03"
      eyebrow="Aktuális kiadás"
      title="Program"
    >
      {hasStructuredSchedule ? (
        <div className="not-prose">
          <div className="mb-3 font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">
            Program napjai
          </div>
          <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grow grid-cols-2 gap-3 overflow-x-auto pb-1 sm:flex sm:flex-wrap">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    setSearchTerm("");
                  }}
                  aria-pressed={!isSearching && selectedDay === day}
                  className={`relative min-h-[62px] shrink-0 rounded-xl border px-5 py-3 text-left font-open text-sm font-semibold transition-all ${!isSearching && selectedDay === day ? "border-[#2c1728] bg-[#2c1728] text-white shadow-[0_8px_20px_rgba(44,23,40,0.18)]" : "border-[#2c1728]/15 bg-white text-[#2c1728] hover:-translate-y-0.5 hover:border-[#d4af6a]"}`}
                >
                  <span className={`mb-1 block text-[10px] uppercase tracking-[0.14em] ${!isSearching && selectedDay === day ? "text-[#e7a9b4]" : "text-[#a58d90]"}`}>
                    {scheduleItems.find((item) => item.day === day)?.date || ""}
                  </span>
                  {day}
                </button>
              ))}
            </div>
            <ScheduleSearch value={searchTerm} onChange={setSearchTerm} />
          </div>
          {isSearching && (
            <div className="mb-4 mt-3 flex justify-end">
              <ResultCount count={visibleItems.length} />
            </div>
          )}
          <div className={`grid gap-3 border-l-2 border-[#d4af6a]/45 pl-4 sm:pl-6 ${isSearching ? "" : "mt-5"}`}>
            {visibleItems.map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-xl border border-[#2c1728]/10 bg-white px-5 py-4 shadow-[0_8px_20px_rgba(44,23,40,0.05)] sm:grid sm:grid-cols-[120px_1fr] sm:gap-5">
                <div>
                  <div className="font-bebas text-2xl text-[#d4af6a]">{item.time || ""}</div>
                  {isSearching && (
                    <div className="mt-1 font-open text-[10px] font-bold uppercase tracking-[0.14em] text-[#a58d90]">
                      {item.day}{item.date ? ` · ${item.date}` : ""}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-open text-base font-semibold text-[#2c1728]">{item.title}</h3>
                  {item.location && <p className="mt-1 font-open text-sm text-[#a58d90]">{item.location}</p>}
                  {item.description && <p className="mt-2 font-open text-sm leading-6 text-[#766561]">{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : schedule.length === 0 ? (
        <p className="font-open text-[16px]" style={{ color: "#6b5a63" }}>
          A program még nem elérhető.
        </p>
      ) : (
        <div className="not-prose">
          <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">
              Program
            </div>
            <ScheduleSearch value={searchTerm} onChange={setSearchTerm} />
          </div>
          {isSearching && (
            <div className="mb-4 mt-3 flex justify-end">
              <ResultCount count={visibleSchedule.length} />
            </div>
          )}
          {visibleSchedule.length > 0 ? (
            <div className={`prose prose-neutral max-w-none ${isSearching ? "" : "mt-5"}`}>
              <RichText blocks={visibleSchedule} />
            </div>
          ) : (
            <p className="mt-5 font-open text-[15px]" style={{ color: "#6b5a63" }}>
              Nincs találat a keresésre.
            </p>
          )}
        </div>
      )}
    </PageShell>
  );
};

export async function getServerSideProps({ preview = false }) {
  const [general, themeColors] = await Promise.all([
    getClient(preview).fetch(querySchedule),
    getThemeColors(preview),
  ]);

  return {
    props: {
      schedule: general?.[0]?.schedule ?? [],
      scheduleItems: general?.[0]?.scheduleItems ?? [],
      themeColors,
      preview,
    },
  };
}

export default Program;
