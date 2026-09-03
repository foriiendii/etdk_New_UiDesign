import { querySchedule } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";
import type { SanityScheduleItem } from "types";
import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";
import { useState } from "react";

type Props = {
  schedule: SanityRichText[];
  scheduleItems: SanityScheduleItem[];
};

const Program = ({ schedule, scheduleItems }: Props) => {
  const days = Array.from(new Set(scheduleItems.map((item) => item.day)));
  const [selectedDay, setSelectedDay] = useState(days[0] || "");
  const visibleItems = scheduleItems.filter((item) => item.day === selectedDay);
  return (
    <PageShell
      number="03"
      eyebrow="Aktuális kiadás"
      title="Program"
    >
      {scheduleItems.length > 0 ? (
        <div className="not-prose">
          <div className="mb-3 font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">
            Program napjai
          </div>
          <div className="mb-8 grid grid-cols-2 gap-3 overflow-x-auto pb-1 sm:flex sm:flex-wrap">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`relative min-h-[62px] shrink-0 rounded-xl border px-5 py-3 text-left font-open text-sm font-semibold transition-all ${selectedDay === day ? "border-[#2c1728] bg-[#2c1728] text-white shadow-[0_8px_20px_rgba(44,23,40,0.18)]" : "border-[#2c1728]/15 bg-white text-[#2c1728] hover:-translate-y-0.5 hover:border-[#d4af6a]"}`}
              >
                <span className={`mb-1 block text-[10px] uppercase tracking-[0.14em] ${selectedDay === day ? "text-[#e7a9b4]" : "text-[#a58d90]"}`}>
                  {scheduleItems.find((item) => item.day === day)?.date || ""}
                </span>
                {day}
              </button>
            ))}
          </div>
          <div className="grid gap-3 border-l-2 border-[#d4af6a]/45 pl-4 sm:pl-6">
            {visibleItems.map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-xl border border-[#2c1728]/10 bg-white px-5 py-4 shadow-[0_8px_20px_rgba(44,23,40,0.05)] sm:grid sm:grid-cols-[120px_1fr] sm:gap-5">
                <div className="font-bebas text-2xl text-[#d4af6a]">{item.time || ""}</div>
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
        <div className="prose prose-neutral max-w-none">
          <RichText blocks={schedule} />
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
